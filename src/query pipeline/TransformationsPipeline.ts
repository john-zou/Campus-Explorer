import { AllData } from "../data/AllData";
import { invalid } from "./QueryPipeline";
import { validateKey } from "./ValidateKey";
import { IDHolder } from "./IDHolder";
import { ResultTooLargeError } from "../controller/IInsightFacade";
import { Dataset } from "../data/Dataset";
import { validateOptions } from "./ValidateOptions";
import { endOfPipeline } from "./EndOfPipeline";
const Decimal = require("decimal.js");

/**
 * Entry of Transformations Pipeline
 *
 * @throws InsightError
 *
 * Validation:
 * - Group: an inhabited array
 * - Apply: an array
 * - Too many keys in TRANSFORMATIONS
 *
 * Processing:
 * - Next pipeline stage: TPGroup
 */
export const transformationsPipeline = (query: any,
                                        allData: AllData,
                                        filteringHappened = false,
                                        filteredElements: any[] = null,
                                        idHolder = new IDHolder()): any[] => {
    const transformations = query.TRANSFORMATIONS;
    const group = transformations.GROUP;

    // Validation
    if (!Array.isArray(group) || group.length === 0) {
        invalid("TRANSFORMATIONS.GROUP (not an inhabited array)");
    }
    const apply = transformations.APPLY;
    if (!Array.isArray(apply)) {
        invalid("TRANSFORMATIONS.APPLY (not an array)");
    }

    if (Object.keys(transformations).length !== 2) {
        invalid("TRANSFORMATIONS (wrong number of keys)");
    }

    // Processing
    return TPGroup(query, allData, filteringHappened, filteredElements, idHolder);
};

/**
 * Transformations Pipeline Stage: Group
 *
 * @throws InsightError
 * @throws ResultTooLargeError
 *
 * Validation:
 * - Each element of TRANSFORMATIONS.GROUP must be a valid key
 * - Verifies singularity of ID (sets ID if hasn't already been set)
 *
 * Processing:
 * - Groups elements based on group keys
 * - Next pipeline stage: TPApply
 */
const TPGroup = (query: any,
                 allData: AllData,
                 filteringHappened: boolean,
                 filteredElements: any[],
                 idHolder: IDHolder): any[] => {
    // Validation
    let groupKeys: any[] = query.TRANSFORMATIONS.GROUP;
    // Validation of GROUP elements (keys), and setting of idHolder if it hasn't been set
    groupKeys.forEach((key) => validateKey(key, allData, idHolder));

    // Processing
    let groupsOfElements: any[];

    if (filteringHappened) {
        groupsOfElements = makeGroups(groupKeys, filteredElements);
    } else {
        const dataset: Dataset = allData.getDataset(idHolder.get());
        groupsOfElements = makeGroups(groupKeys, dataset.Elements);
    }

    return TPApply(query, groupsOfElements, idHolder, allData);
};

/**
 * Transformations Pipeline Stage: Apply
 *
 * @throws InsightError
 *
 * Validation:
 * - Each element of TRANSFORMATIONS.APPLYRULE is validated
 *
 * Processing:
 * - Creation of group objects
 * - Next pipeline stage: Options
 */
const TPApply = (query: any,
                 groupsOfElements: any[][],
                 idHolder: IDHolder,
                 allData: AllData): any[] => {
    const [groupObjects, applyKeys] = makeGroupObjects(query, groupsOfElements, allData, idHolder);
    return TPOptions(query, groupObjects, applyKeys, idHolder, allData);
};

const TPOptions = (query: any,
                   groupObjects: any[][],
                   applyKeys: string[],
                   idHolder: IDHolder,
                   allData: AllData): any[] => {
    // Validation
    validateOptions(query, allData, idHolder, true, query.TRANSFORMATIONS.GROUP, applyKeys);

    // Processing
    return endOfPipeline(query, groupObjects);
};

const makeGroups = (groupKeys: string[], elements: any[]): any[][] => {
    const groups: any[][] = [];

    // tl;dr either join a group or make a new one

    objectsloop:
    for (const element of elements) {
        groupsloop:
        for (const group of groups) {
            // keys loop
            for (const groupKey of groupKeys) {
                // Check to make sures keys are the same as first thing in the group
                const pioneer =  group[0];
                if (pioneer[groupKey] !== element[groupKey]) {
                    continue groupsloop;
                }
            }
            group.push(element);
            continue objectsloop;
        }
        // Make a new group
        groups.push([element]);
        if (groups.length > 5000) {
            throw new ResultTooLargeError("Over 5000 groups");
        }
    }
    return groups;
};

/**
 * Apply
 */
const makeGroupObjects = (query: any, groups: any[][], allData: AllData, idHolder: IDHolder): [any[], string[]] => {
    const groupkeys: string[]  = query.TRANSFORMATIONS.GROUP;
    const applyrules: any[] = query.TRANSFORMATIONS.APPLY;
    const groupObjects: any[] = [];
    const applyKeys: string[] = [];
    for (const group of groups) {
        const groupObject: any = {};
        for (const applyrule of applyrules) {
            validateApplyrule(applyrule, allData, idHolder);
            const applyKey: string = Object.keys(applyrule)[0]; // applyKey e.g. "sumLat"
            if (applyKeys.includes(applyKey)) {
                invalid("Applykey not unique: " + applyKey);
            }
            applyKeys.push(applyKey);
            const av: any = Object.values(applyrule)[0]; // abstract object
            const applyToken: string = Object.keys(av)[0]; // MAX / MIN / AVG / SUM / COUNT
            const field = (Object.values(av)[0] as string).split("_")[1]; // field e.g. avg, year, lon, lat
            switch (applyToken) {
                case "MAX":
                    groupObject[applyKey] = max(group, field);
                    break;
                case "MIN":
                    groupObject[applyKey] = min(group, field);
                    break;
                case "AVG":
                    groupObject[applyKey] = ave(group, field);
                    break;
                case "SUM":
                    const summ = sum(group, field);
                    groupObject[applyKey] = Number(summ.toFixed(2));
                    break;
                case "COUNT":
                    groupObject[applyKey] = count(group, field);
                    break;
            }
        }
        for (const groupkey of groupkeys) {
            groupObject[groupkey] = group[0][groupkey];
        }
        groupObjects.push(groupObject);
    }
    return [groupObjects, applyKeys];
};

const validateApplyrule = (applyrule: any, allData: AllData, idHolder: IDHolder): void => {
    if (!applyrule || typeof applyrule !== "object") {
        invalid("TRANSFORMATIONS.APPLY has invalid applyrule: wrong type");
    }
    const applyruleKeys: string[] = Object.keys(applyrule);
    if (applyruleKeys.length !== 1) {
        invalid("APPLYRULE must have only 1 property");
    }
    // Check for valid applykey
    if (applyruleKeys[0].includes("_")) {
        invalid("APPLYRULE cannot include underscore");
    }

    if (Object.keys(applyruleKeys).length !== 1) {
        invalid("APPLYKEY does not have valid fields");
    }
    // Check for valid token
    if (!["MAX", "MIN", "COUNT", "AVG", "SUM"].includes(Object.keys(applyruleKeys)[0])) {
        invalid("APPLYRULE token invalid");
    }

    // Validate key
    const key = Object.values(applyrule[0])[0];
    const canBeSKey = Object.keys(applyrule[0])[0] === "COUNT";
    validateKey(key, allData, idHolder, !canBeSKey, false);
};

function ave(groupMembers: any[], field: string) {
    let total = new Decimal(0);
    for (const member of groupMembers) {
        const num = new Decimal(member[field]);
        total = Decimal.add(num, total);
    }
    const avg = total.toNumber() / groupMembers.length;
    return Number(avg.toFixed(2));
}

function min(groupMembers: any[], field: string) {
    let minn = groupMembers[0][field];
    for (const member of groupMembers) {
        if (member[field] < minn) {
            minn = member[field];
        }
    }
    return minn;
}

function max(groupMembers: any[], field: string) {
    let maxx = groupMembers[0][field];
    for (const member of groupMembers) {
        if (member[field] > maxx) {
            maxx = member[field];
        }
    }
    return maxx;
}

function sum(groupMembers: any[], key: string) {
    let summ = 0;
    for (const member of groupMembers) {
        summ += member[key];
    }
    return summ;
}

function count(groupMembers: any[], key: string) {
    let uniques: any[] = [];
    for ( const member of groupMembers) {
        if (!uniques.includes(member[key])) {
            uniques.push(member[key]);
        }
    }
    return uniques.length;
}
