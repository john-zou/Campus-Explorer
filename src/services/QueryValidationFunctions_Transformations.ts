import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES, MFIELDS_ROOMS } from "../query_schema/MFields";
import { InsightDatasetKind, InsightDataset, InsightError } from "../controller/IInsightFacade";
import { parseKeystring as splitOn_ } from "./QueryValidationFunctions_Body";
import { SFIELDS_COURSES, SFIELDS_ROOMS } from "../query_schema/SFields";
import { IParsedData } from "../data/IParsedData";
import { OwensReality } from "../data/OwensReality";
import { JohnsRealityCheck } from "../data/JohnsRealityCheck";
import Insight, { WT } from "../util/Insight";
import { APPLYTOKENS } from "../query_schema/ApplyTokens";

/**
 * @returns [ID, groups, applyKeys]
 */
export function getKeysFromTransformations(q: any, owen: OwensReality): [string, string[], string[]] {
    const t = q.TRANSFORMATIONS;
    // Always has a group, always has an apply
    if (t == null || typeof t !== "object") {
        WT(F.TransformationsIsNotAnObject);
    }
    const keys = Object.keys(t);
    if (!keys.includes("GROUP")) {
        WT(F.TransformationsIsMissingGroup);
    }
    if (!keys.includes("APPLY")) {
        WT(F.TransformationsIsMissingApply);
    }
    if (keys.length !== 2) {
        WT(F.TransformationsDoesntHaveTwoKeys);
    }

    // groupKeys have an _ prefix
    const [id, groupFields]: [string, string[]] = getGroupFields(t.GROUP, owen);

    const applyKeys: string[] = getApplyKeys(t.APPLY, id, owen);

    // All checks passed
    return [id, groupFields, applyKeys];
}

/**
 * @returns [id, fields] the fields have a prepended _ to prevent collision with applykeys
 */
export function getGroupFields(g: any, owen: OwensReality): [string, string[]] {
    if (!Array.isArray(g)) {
        WT(F.GroupIsNotAnArray);
    }
    if (g.length === 0) {
        WT(F.GroupMustBeNonEmptyArray);
    }
    let id: string;
    const fields: string[] = [];
    for (const k of g) {
        const [nextId, field] = verifyAndGetIdAndField(k, owen);
        if (id === undefined) {
            id = nextId;
        } else {
            if (id !== nextId) {
                WT(F.MoreThanOneId);
            }
        }
        if (!fields.includes("_" + field)) {
            fields.push("_" + field); // add underscore to prevent collion with applykey
        }
    }
    return [id, fields];
}

/**
 * throws InsightError if there is anything wrong with either ID or Field
 * (makes sure ID exists, and field type matches ID (courses vs rooms))
 *
 * (DOES NOT ADD _ TO THE FIELD)
 */
export function verifyAndGetIdAndField(k: any, owen: OwensReality): [string, string] {
    const res: [string, string] = splitOn_(k);
    const parsedId = res[0];
    const field = res[1];

    switch (owen.checkID(parsedId)) {
        case JohnsRealityCheck.NotFound: WT(F.IdDoesNotExist);
        case JohnsRealityCheck.Courses:
            if (MFIELDS_COURSES.includes(field) || SFIELDS_COURSES.includes(field)) {
                return [parsedId, field];
            } else {
                WT(F.InvalidKey);
            }
        case JohnsRealityCheck.Rooms:
            if (MFIELDS_ROOMS.includes(field) || SFIELDS_ROOMS.includes(field)) {
                return [parsedId, field];
            } else {
                WT(F.InvalidKey);
            }
    }
}

/*
 * APPLY ::= 'APPLY: [' (APPLYRULE (', ' APPLYRULE )* )? ']'
 * APPLYRULE ::= '{' applykey ': {' APPLYTOKEN ':' key '}}'
 * APPLYTOKEN ::= 'MAX' | 'MIN' | 'AVG' | 'COUNT' | 'SUM'
 */
/**
 * @returns string array of applykeys if valid (throws if not)
 */
export function getApplyKeys(a: any, id: string, owen: OwensReality): string[] {
    // ID is guaranteed to be in dataset already (comes from getGroupKeys)
    if (!Array.isArray(a)) {
        WT(F.ApplyIsNotAnArray);
    }
    if (a.length === 0) {
        WT(F.ApplyMustBeNonEmptyArray);
    }
    const applyKeys: string[] = [];

    // Iterate through the ApplyRules array
    for (const applyRule of a) {
        // check if it's an object
        // APPLYRULE
        const applyKey = getApplyKeyFromApplyRule(applyRule, id, owen);
        if (applyKeys.includes(applyKey)) {
            WT(F.ApplyKeysMustBeUnique);
        }
        applyKeys.push(applyKey);
    }
    // The entire array is fine
    return applyKeys;
}

/**
 * Throws InsightError if the applykey is invalid
 */
export function getApplyKeyFromApplyRule(applyRule: any, id: string, owen: OwensReality): string {
    if (applyRule == null || typeof applyRule !== "object") {
        WT(F.ApplyRuleMustBeAnObject);
    }
    // check how many keys it has
    if (Object.keys(applyRule).length !== 1) {
        WT(F.ApplyRuleMustHaveExactlyOneKey);
    }
    // the object is always { applykey: { APPLYTOKEN: key } }
    // applykey is supposed to be unique. this is what gets returned.
    // it cannot have underscore!
    const applyKey = Object.keys(applyRule)[0];

    if (applyKey.includes("_")) {
        WT(F.ApplyKeyContainsUnderscore);
    }

    // The "core" = { APPLYTOKEN: key }
    const core: any = applyRule[applyKey];
    if (core == null || typeof core !== "object") {
        WT(F.ApplyKeyCoreMustBeObject);
    }
    const coreKeys = Object.keys(core);
    if (coreKeys.length !== 1) {
        WT(F.ApplyKeyCoreMustHaveOneKey);
    }
    const applyToken = coreKeys[0];
    if (!APPLYTOKENS.includes(applyToken)) {
        WT(F.ApplyKeyCore_Is_Invalid);
    }
    const key = core[applyToken];
    validateKeyForApplyToken(key, id, owen, applyToken);
    return applyKey;
}

export function validateKeyForApplyToken(key: any, id: string, owen: OwensReality, token: string) {
    const [idd, field] = verifyAndGetIdAndField(key, owen);
    if (id !== idd) {
        WT(F.MoreThanOneId);
    }
    // COUNT works for both SFields and MFields, but the rest only work for MFields
    if (token === "COUNT") {
        return;
    } else {
        // Don't need to check whether it belongs to courses or rooms because validateKey already does that
        if (MFIELDS_COURSES.includes(field) || MFIELDS_ROOMS.includes(field)) {
            return;
        } else {
            WT(F.ApplyTokenCannotBeAppliedToSField);
        }
    }
}
