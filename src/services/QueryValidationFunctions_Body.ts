import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES as MFields} from "../query_schema/MFields";
import { SFIELDS_COURSES as SFields} from "../query_schema/SFields";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export function validateFilterArray(filters: any,
                                    datasetIds: string[],
                                    kind: InsightDatasetKind): [F, string] {
    if (filters == null) {
        return [F.WrongType_LogicComparison, null];
    }
    // Check that the value is indeed an array
    if (!Array.isArray(filters)) {
        return [F.WrongType_LogicComparison, null];
    }
    // Check that all the ID strings are the same, then return it along with a "Valid"
    if (filters.length === 0) {
        return [F.Empty_LogicComparison, null];
    }
    // Essentially, folds the validateFilter results into one, making sure they are
    // all valid and all have the same ID.
    let firstResult: [F, string] = validateFilter(filters[0], datasetIds, kind);
    if (firstResult[0] !== F.Valid) {
        return firstResult;
    }
    for (let i = 1; i < filters.length; ++i) {
        let nextResult: [F, string] = validateFilter(filters[i], datasetIds, kind);
        if (nextResult[0] !== F.Valid) {
            return nextResult;
        }
        if (nextResult[1] !== firstResult[1]) { // verify they have the same ID
            return [F.MoreThanOneId, ""];
        }
    }
    return firstResult;
}

export function validateFilter(filter: any, datasetIds: string[],
                               kind: InsightDatasetKind): [F, string]  {

    if (filter == null || typeof filter !== "object") {
        return [F.WrongValue_LogicComparison, null];
    }
    if (hasTooManyKeys(filter, 1)) {
        return [F.TooManyKeys_Filter, null];
    }
    if (Object.keys(filter).length === 0) {
        return [F.HasNoKeys_Filter, null];
    }
    const key = Object.keys(filter)[0];
    switch (key) {
        case "AND": return validateFilterArray(filter.AND, datasetIds, kind);
        case "OR": return validateFilterArray(filter.OR, datasetIds, kind);
        case "NOT": return validateFilter(filter.NOT, datasetIds, kind);
        case "LT": return validateMComparison(filter.LT, datasetIds, kind);
        case "GT": return validateMComparison(filter.GT, datasetIds, kind);
        case "EQ": return validateMComparison(filter.EQ, datasetIds, kind);
        case "IS": return validateSComparison(filter.IS, datasetIds, kind);
        default: return [F.WrongKey_Filter, null];
    }
}

export function validateSComparison(sc: any, datasetIds: string[]
    ,                               kind: InsightDatasetKind): [F, string] {
    if (Array.isArray(sc)) {
        return [F.WrongType_SComparison, null];
    }
    if (sc == null || typeof sc !== "object") {
        return [F.WrongType_SComparison, null];
    }
    if (hasTooManyKeys(sc, 1)) {
        return [F.TooManyKeys_SComparison, null];
    }
    if (Object.keys(sc).length === 0) {
        return [F.HasNoKeys_SComparison, null];
    }
    const key: string = Object.keys(sc)[0];
    const parseResult: [F, string, string] = parseKeystring(key);
    const parseResultFlag: F = parseResult[0];
    // Flag, idstring, sfield
    if (parseResultFlag !== F.Valid) {
        return [parseResultFlag, null];
    }
    const idstring: string = parseResult[1];
    if (!datasetIds.includes(idstring)) {
        return [F.IdDoesNotExist, null];
    }
    const sfield: string = parseResult[2];
    // Ensure it's non-empty;
    if (sfield.length === 0) {
        return [F.EmptySField, null];
    }
    if (!SFields.includes(sfield)) {
        return [F.InvalidSField, null];
    }
    // Validate the value -- it must be a string and must have no internal asterisk
    const value: any = Object.values(sc)[0];
    if (value == null || typeof value !== "string") {
        return [F.SValueNotAString, null];
    }
    // Finally, validate the value, i.e. check for internal asterisk.
    // If its length is 0, it is valid.
    const sValueValidationResult: F = validateSValue(value);
    if (sValueValidationResult !== F.Valid) {
        return [sValueValidationResult, null];
    } else {
        return [F.Valid, idstring];
    }
}

export function validateSValue(value: string): F {
    // SValue is (optional *) ++ inputstring ++ (optional *)
    // inputstring ::= [^*]* // Zero or more of any character, except asterisk.

    // Check every internal character in sValue
    for (let i = 1; i < value.length - 1; ++i) {
        if (value[i] === "*") {
            return F.SValueContainsInternalAsterisk;
        }
    }
    return F.Valid;
}

export function validateMComparison(mc: any,
                                    datasetIds: string[],
                                    kind: InsightDatasetKind): [F, string] {
    if (Array.isArray(mc)) {
        return [F.WrongType_MComparison, null];
    }
    if (mc == null || typeof mc !== "object") {
        return [F.WrongType_MComparison, null];
    }
    if (hasTooManyKeys(mc, 1)) {
        return [F.TooManyKeys_MComparison, null];
    }
    if (Object.keys(mc).length === 0) {
        return [F.HasNoKeys_MComparison, null];
    }
    const key: string = Object.keys(mc)[0];
    const parseResult: [F, string, string] = parseKeystring(key);
    const parseResultFlag: F = parseResult[0];
    if (parseResultFlag !== F.Valid) {
        return [parseResultFlag, null];
    }
    const id: string = parseResult[1];
    if (!datasetIds.includes(id)) {
        return [F.IdDoesNotExist, null];
    }
    const mfield: string = parseResult[2];
    if (mfield.length === 0) {
        return [F.EmptyMField, null];
    }
    if (!MFields.includes(mfield)) {
        return [F.InvalidMField, null];
    }
    // Validate the value -- it must be a number
    const value: any = Object.values(mc)[0];
    if (value == null || typeof value !== "number") {
        return [F.MValueNotANumber, null];
    }
    // It's valid!
    return [F.Valid, id];
}

// idstring_m/sfield
export function parseKeystring(str: string): [F, string, string] {
    if (str == null || typeof str !== "string") {
        return [F.KeystringIsNotAString, null, null];
    }
    let splitResultArray: string[] = str.split("_");
    // If there is exactly one underscore, then the length of the split will be exactly 2
    if (splitResultArray.length === 1) {
        return [F.NoUnderscore, null, null];
    }
    if (splitResultArray.length > 2) {
        return [F.TooManyUnderscores, null, null];
    }
    // Idstring must have one or more of any character
    if (splitResultArray[0].length === 0) {
        return [F.NoIdstring, null, null];
    }
    // The m/sfield will be checked in the calling function to return more specific result flag if invalid
    return [F.Valid, splitResultArray[0], splitResultArray[1]];
}

export function hasTooManyKeys(json: any, max: number) {
    return Object.keys(json).length > max;
}

export function isMissingKey(json: any, key: string): boolean {
    return !Object.keys(json).includes(key);
}
