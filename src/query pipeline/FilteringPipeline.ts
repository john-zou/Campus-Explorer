import { AllData } from "../data/AllData";
import { transformationsPipeline } from "./TransformationsPipeline";
import { IDHolder } from "./IDHolder";
import { basicPipeline } from "./BasicPipeline";
import { invalid } from "./QueryPipeline";
import { ResultTooLargeError, InsightDatasetKind } from "../controller/IInsightFacade";
import { MagicQueue } from "../D2/query/Ultra Instinct/MagicQueue";
import { validateKey } from "./ValidateKey";
import { getInputstring } from "../query_schema/SmartQueryBuildFunctions";
import { isMatch } from "../services/QP2_Helpers";

/**
 * Entry of Filtering Pipeline
 *
 * Splits into two pipeline paths depending on whether WHERE is an empty object { }
 *
 * @param query query JSON object
 * @param allData
 */
export const filteringPipeline = (query: any, allData: AllData): any[] => {
    const where: any = query.WHERE;
    const whereIsAnEmptyObject: boolean = Object.keys(where).length === 0;

    if (whereIsAnEmptyObject) {
        return FPEmpty(query, allData);
    } else {
        return FPFull(query, allData);
    }
};

/**
 * Splits into either Transformations Pipeline or Basic Pipeline
 */
const FPEmpty = (query: any, allData: AllData): any[] => {
    const transformations = query.TRANSFORMATIONS;
    if (transformations) {
        return transformationsPipeline(query, allData);
    } else {
        return basicPipeline(query, allData);
    }
};

/**
 * Validates WHERE and filters the data, then...
 * Splits into either Transformations Pipeline or Basic Pipeline
 *
 * @throws InsightError
 * @throws ResultTooLargeError
 *
 * Validation:
 * - FILTER (syntax and semantics)
 * - Creates IDHolder instance to enforce singularity of ID until retirement of query
 *
 * Processing:
 * - Filters the data
 */
const FPFull = (query: any, allData: AllData): any[] => {
    const where = query.WHERE;

    // Create new IDHolder for enforcement of singularity of ID
    const idHolder = new IDHolder();

    const transformations = query.TRANSFORMATIONS;
    if (transformations) {
        const filteredElements = filterElements(where, allData, idHolder);
        return transformationsPipeline(query, allData, true, filteredElements, idHolder);
    } else {
        const filteredElements = filterElements(where, allData, idHolder, true);
        return basicPipeline(query, allData, true, filteredElements, idHolder);
    }
};

/**
 * @throws InsightError if query is invalid
 *
 */
const filterElements = (filter: any, allData: AllData, idHolder: IDHolder, shouldThrow = false): any[] => {

    setID(filter, allData, idHolder);

    const id = idHolder.get();
    if (!id) {
        invalid("FILTER");
    }
    const dataset = allData.getDataset(id);
    const elements = dataset.Elements;
    const filteredElements = [];
    for (const e of elements) {
        if (filterElement(e, filter, idHolder, allData)) {
            filteredElements.push(e);
            if (shouldThrow) {
                if (filteredElements.length > 5000) {
                    throw new ResultTooLargeError
                        ("Too many elements passed through the filter, and there are no transformations");
                }
            }
        }
    }
    return filteredElements;
};

/**
 * Searches for an ID in the filter tree and sets it to idHolder
 */
const setID = (filter: any, allData: AllData, idHolder: IDHolder): void => {
    // BFS for an ID
    const queue = new MagicQueue<any>();
    queue.enqueue(filter);

    while (queue.StillHasStuff()) {
        const f = queue.dequeue();
        validateFilter(f);
        const operator: string = Object.keys(f)[0];
        switch (operator) {
            case "NOT":
                queue.enqueue(f[operator]);
                break;
            case "AND":
            case "OR":
                queue.enqueueAll(f[operator]);
                break;
            case "GT":
            case "LT":
            case "EQ":
            case "IS":
                validateKey(f[operator], allData, idHolder); // Get the ID from validateKey
                return;
            default:
                invalid("FILTER: Invalid Operator (NOT, AND, OR, etc.)");
        }
    }
};

const validateFilter = (filter: any): void => {
    // Validation
    if (!filter || typeof filter !== "object") {
        invalid("FILTER: Not an object");
    }
    if (Object.keys(filter).length !== 1) {
        invalid("FILTER: Not exactly 1 key");
    }
};

const filterElement = (element: any,
                       filter: any,
                       idHolder: IDHolder,
                       allData: AllData): boolean => {

    // Validation
    validateFilter(filter);

    // Processing
    const operator: string = Object.keys(filter)[0];

    switch (operator) {
        case "NOT": return !filterElement(element, filter[operator], idHolder, allData);
        case "AND": return filterElementAND(element, filter[operator], idHolder, allData);
        case "OR": return filterElementOR(element, filter[operator], idHolder, allData);
        case "GT":
        case "LT":
        case "EQ": return filterElementMComparison(element, operator, filter[operator], idHolder, allData);
        case "IS": return filterElementSComparison(element, filter[operator], idHolder, allData);
        default:
            invalid("FILTER: Invalid Operator (NOT, AND, OR, etc.)");
    }
};

const filterElementAND
= (element: any, filters: any[], idHolder: IDHolder, allData: AllData): boolean => {

    // Validation
    if (!Array.isArray(filters) || filters.length === 0) {
        invalid("FILTER: AND: not inhabited array");
    }

    // Processing
    let pass = true;
    for (const filter of filters) {
        pass = pass && filterElement(element, filter, idHolder, allData);
    }

    return pass;
};

const filterElementOR
= (element: any, filters: any[], idHolder: IDHolder, allData: AllData): boolean => {

    // Validation
    if (!Array.isArray(filters) || filters.length === 0) {
        invalid("FILTER: OR: not inhabited array");
    }

    // Processing
    let pass = false;
    for (const filter of filters) {
        pass = pass || filterElement(element, filter, idHolder, allData);
    }
    return pass;
};

const filterElementMComparison = (element: any,
                                  operator: string,
                                  mcomparison: any,
                                  idHolder: IDHolder,
                                  allData: AllData): boolean => {

    // Validation
    if (!mcomparison || typeof mcomparison !== "object") {
        invalid("FILTER - MComparison not an object");
    }
    if (Object.keys(mcomparison).length !== 1) {
        invalid("FILTER - MComparison doens't have exactly 1 key");
    }
    const key = Object.keys(mcomparison)[0];
    validateKey(key, allData, idHolder, true, false);
    const value = mcomparison[key];
    if (value == null || typeof value !== "number") {
        invalid("FILTER - MComparison value must be a number");
    }

    // Processing
    switch (operator) {
        case "GT": return element[key] > value;
        case "LT": return element[key] < value;
        case "EQ": return element[key] === value;
    }
};

const filterElementSComparison = (element: any,
                                  scomparison: any,
                                  idHolder: IDHolder,
                                  allData: AllData): boolean => {

    // Validation
    if (!scomparison || typeof scomparison !== "object") {
        invalid("FILTER - SComparison not an object");
    }
    if (Object.keys(scomparison).length !== 1) {
        invalid("FILTER - SComparison doens't have exactly 1 key");
    }
    const key = Object.keys(scomparison)[0];
    validateKey(key, allData, idHolder, false, true);
    const inputstring = scomparison[key];
    if (inputstring == null || typeof inputstring !== "string") {
        invalid("FILTER - SComparison value must be a string");
    }

    // Processing
    const [str, hasPreAsterisk, hasPostAsterisk] = getInputstring(scomparison);
    return isMatch(element[key], str, hasPreAsterisk, hasPostAsterisk);
};
