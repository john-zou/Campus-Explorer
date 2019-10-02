import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { mfields as MFields} from "../query_schema/MFields";
import { sfields as SFields} from "../query_schema/SFields";

export function validateFilterArray(filters: any, datasetIds: string[]): [F, string] {
    // Check that the value is indeed an array
    if (!Array.isArray(filters)) {
        return [F.WrongType_LogicComparison, null];
    }
    // Check that all the ID strings are the same, then return it along with a "Valid"
    if (!filters || filters.length === 0) {
        return [F.WrongType_LogicComparison, null];
    }
    // Essentially, folds the validateFilter results into one, making sure they are
    // all valid and all have the same ID.
    let firstResult: [F, string] = this.validateFilter(filters[0], datasetIds);
    if (firstResult[0] !== F.Valid) {
        return firstResult;
    }
    for (let i = 1; i < filters.length; ++i) {
        let nextResult: [F, string] = this.validateFilter(filters[i], datasetIds);
        if (nextResult[0] !== F.Valid) {
            return nextResult;
        }
        if (nextResult[1] !== firstResult[1]) { // verify they have the same ID
            return [F.MoreThanOneId, ""];
        }
    }
    return firstResult;
}

export function validateFilter(filter: any, datasetIds: string[]): [F, string]  {
    if (filter == null || typeof filter !== "object") {
        return [F.WrongValue_LogicComparison, null];
    }
    if (this.hasTooManyKeys(filter, 1)) {
        return [F.TooManyKeys_Filter, null];
    }
    const key = Object.keys(filter)[0];
    switch (key) {
        case "AND": return this.validateFilterArray(filter.AND, datasetIds);
        case "OR": return this.validateFilterArray(filter.OR, datasetIds);
        case "NOT": return this.validateFilter(filter.NOT, datasetIds);
        case "LT": return this.validateMComparison(filter.LT, datasetIds);
        case "GT": return this.validateMComparison(filter.GT, datasetIds);
        case "EQ": return this.validateMComparison(filter.EQ, datasetIds);
        case "IS": return this.validateSComparison(filter.IS, datasetIds);
        default: return [F.WrongKey_Filter, null];
    }
}

export function validateSComparison(sc: any, datasetIds: string[]): [F, string] {
    if (Array.isArray(sc)) {
        return [F.WrongType_SComparison, null];
    }
    if (sc == null || typeof sc !== "object") {
        return [F.WrongType_SComparison, null];
    }
    if (this.hasTooManyKeys(sc, 1)) {
        return [F.TooManyKeys_SComparison, null];
    }
    if (Object.keys(sc).length === 0) {
        return [F.HasNoKeys_SComparison, null];
    }
    const key: string = Object.keys(sc)[0];
    const parseResult: [F, string, string] = this.parseKeystring(key);
    const parseResultFlag: F = parseResult[0];
    if (parseResultFlag !== F.Valid) {
        return [parseResultFlag, null];
    }
    const id: string = parseResult[1];
    if (!datasetIds.includes(id)) {
        return [F.IdDoesNotExist, null];
    }
    const sfield: string = parseResult[2];
    if (!SFields.includes(sfield)) {
        return [F.InvalidSField, null];
    }
    // Validate the value -- it must be a string and must have no internal asterisk
    const value: any = Object.values(sc)[0];
    if (value == null || typeof value !== "string") {
        return [F.SValueNotAString, null];
    }
    // Finally, validate the value!
    const sValueValidationResult: F = this.validateSValue(value);
    if (sValueValidationResult !== F.Valid) {
        return [sValueValidationResult, null];
    } else {
        return [F.Valid, id];
    }
}

export function validateSValue(value: string): F {
    for (let i = 1; i < value.length - 1; ++i) {
        if (value[i] === "*") {
            return F.SValueContainsInternalAsterisk;
        }
    }
    return F.Valid;
}

export function validateMComparison(mc: any, datasetIds: string[]): [F, string] {
    if (Array.isArray(mc)) {
        return [F.WrongType_MComparison, null];
    }
    if (mc == null || typeof mc !== "object") {
        return [F.WrongType_MComparison, null];
    }
    if (this.hasTooManyKeys(mc, 1)) {
        return [F.TooManyKeys_MComparison, null];
    }
    if (Object.keys(mc).length === 0) {
        return [F.HasNoKeys_MComparison, null];
    }
    const key: string = Object.keys(mc)[0];
    const parseResult: [F, string, string] = this.parseKeystring(key);
    const parseResultFlag: F = parseResult[0];
    if (parseResultFlag !== F.Valid) {
        return [parseResultFlag, null];
    }
    const id: string = parseResult[1];
    if (!datasetIds.includes(id)) {
        return [F.IdDoesNotExist, null];
    }
    const mfield: string = parseResult[2];
    if (!MFields.includes(mfield)) {
        return [F.InvalidMfield, null];
    }
    // Validate the value -- it must be a number
    const value: any = Object.values(mc)[0];
    if (value == null || typeof value !== "number") {
        return [F.MValueNotANumber, null];
    }
    // It's valid!
    return [F.Valid, id];
}

export function parseKeystring(str: string): [F, string, string] {
    let ss: string[] = str.split("_");
    if (ss.length === 1) {
        return [F.NoUnderscore, null, null];
    }
    if (ss.length > 2) {
        return [F.TooManyUnderscores, null, null];
    }
    return [F.Valid, ss[0], ss[1]];
}

export function hasTooManyKeys(json: any, max: number) {
    return Object.keys(json).length > max;
}

export function isMissingKey(json: any, key: string): boolean {
    return !Object.keys(json).includes(key);
}
