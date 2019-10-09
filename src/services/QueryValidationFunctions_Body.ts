import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES as MFields, MFIELDS_COURSES, MFIELDS_ROOMS} from "../query_schema/MFields";
import { SFIELDS_COURSES as SFields, SFIELDS_COURSES, SFIELDS_ROOMS} from "../query_schema/SFields";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { OwensReality } from "../data/OwensReality";
import { WT } from "../util/Insight";
import { JohnsRealityCheck } from "../data/JohnsRealityCheck";

export function validateFilterArray(filters: any,
                                    owen: OwensReality): string {
    if (filters == null) {
        WT(F.WrongType_LogicComparison);
    }
    // Check that the value is indeed an array
    if (!Array.isArray(filters)) {
        WT(F.WrongType_LogicComparison);
    }
    // Check that all the ID strings are the same, then return it along with a "Valid"
    if (filters.length === 0) {
        WT(F.Empty_LogicComparison);
    }
    // Essentially, folds the validateFilter results into one, making sure they are
    // all valid and all have the same ID.
    let firstId: string = validateFilter(filters[0], owen);
    for (let i = 1; i < filters.length; ++i) {
        let nextId: string = validateFilter(filters[i], owen);
        if (nextId !== firstId) { // verify they have the same ID
            WT(F.MoreThanOneId);
        }
    }
    return firstId;
}

export function validateFilter(filter: any, owen: OwensReality): string  {

    if (filter == null || typeof filter !== "object") {
        WT(F.WrongValue_LogicComparison);
    }
    if (hasTooManyKeys(filter, 1)) {
        WT(F.TooManyKeys_Filter);
    }
    if (Object.keys(filter).length === 0) {
        WT(F.HasNoKeys_Filter);
    }
    const key = Object.keys(filter)[0];
    switch (key) {
        case "AND": return validateFilterArray(filter.AND, owen);
        case "OR": return validateFilterArray(filter.OR, owen);
        case "NOT": return validateFilter(filter.NOT, owen);
        case "LT": return validateMComparison(filter.LT, owen);
        case "GT": return validateMComparison(filter.GT, owen);
        case "EQ": return validateMComparison(filter.EQ, owen);
        case "IS": return validateSComparison(filter.IS, owen);
        default: WT(F.WrongKey_Filter);
    }
}

export function validateSComparison(sc: any, owen: OwensReality): string {
    if (Array.isArray(sc)) {
        WT(F.WrongType_SComparison);
    }
    if (sc == null || typeof sc !== "object") {
        WT(F.WrongType_SComparison);
    }
    if (hasTooManyKeys(sc, 1)) {
        WT(F.TooManyKeys_SComparison);
    }
    if (Object.keys(sc).length === 0) {
        WT(F.HasNoKeys_SComparison);
    }
    const key: string = Object.keys(sc)[0];
    const parseResult: [string, string] = parseKeystring(key);
    const id: string = parseResult[0];
    const field: string = parseResult[1];
    switch (owen.checkID(id)) {
        case JohnsRealityCheck.Courses:
            if (!SFIELDS_COURSES.includes(field)) {
                WT(F.InvalidSField);
            }
            break;
        case JohnsRealityCheck.Rooms:
            if (!SFIELDS_ROOMS.includes(field)) {
                WT(F.InvalidMField);
            }
            break;
        case JohnsRealityCheck.NotFound:
            WT(F.IdDoesNotExist);
            break;
    }
    // Validate the value -- it must be a string and must have no internal asterisk
    const value: any = Object.values(sc)[0];
    if (value == null || typeof value !== "string") {
        WT(F.SValueNotAString);
    }
    // Finally, validate the value, i.e. check for internal asterisk.
    // If its length is 0, it is still valid
    validateSValue(value);

    return id;
}

export function validateSValue(value: string) {
    // SValue is (optional *) ++ inputstring ++ (optional *)
    // inputstring ::= [^*]* // Zero or more of any character, except asterisk.

    // Check every internal character in sValue
    for (let i = 1; i < value.length - 1; ++i) {
        if (value[i] === "*") {
            WT(F.SValueContainsInternalAsterisk);
        }
    }
}

export function validateMComparison(mc: any,
                                    owen: OwensReality): string {
    if (Array.isArray(mc)) {
        WT(F.WrongType_MComparison);
    }
    if (mc == null || typeof mc !== "object") {
        WT(F.WrongType_MComparison);
    }
    if (hasTooManyKeys(mc, 1)) {
        WT(F.TooManyKeys_MComparison);
    }
    if (Object.keys(mc).length === 0) {
        WT(F.HasNoKeys_MComparison);
    }
    const key: string = Object.keys(mc)[0];
    const parseResult: [string, string] = parseKeystring(key);
    const id: string = parseResult[0];
    const field: string = parseResult[1];

    switch (owen.checkID(id)) {
        case JohnsRealityCheck.Courses:
            if (!MFIELDS_COURSES.includes(field)) {
                WT(F.InvalidMField);
            }
            break;
        case JohnsRealityCheck.Rooms:
            if (!MFIELDS_ROOMS.includes(field)) {
                WT(F.InvalidMField);
            }
            break;
        case JohnsRealityCheck.NotFound:
            WT(F.IdDoesNotExist);
            break;
    }
    // Validate the value -- it must be a number
    const value: any = Object.values(mc)[0];
    if (value == null || typeof value !== "number") {
        WT(F.MValueNotANumber);
    }
    // It's valid!
    return id;
}

/**
 * splits an id_field into id and field.
 * Throws if: no underscore, too many underscores, empty ID, empty field
 */
export function parseKeystring(str: string): [string, string] {
    if (str == null || typeof str !== "string") {
        WT(F.KeystringIsNotAString);
    }
    let splitResultArray: string[] = str.split("_");
    // If there is exactly one underscore, then the length of the split will be exactly 2
    if (splitResultArray.length === 1) {
        WT(F.NoUnderscore);
    }
    if (splitResultArray.length > 2) {
        WT(F.TooManyUnderscores);
    }
    // Idstring must have one or more of any character
    if (splitResultArray[0].length === 0) {
        WT(F.NoIdstring);
    }
    if (splitResultArray[1].length === 0) {
        WT(F.EmptyField);
    }
    // The m/sfield will be checked in the calling function to return more specific result flag if invalid
    return [splitResultArray[0], splitResultArray[1]];
}

export function hasTooManyKeys(json: any, max: number) {
    return Object.keys(json).length > max;
}

export function isMissingKey(json: any, key: string): boolean {
    return !Object.keys(json).includes(key);
}
