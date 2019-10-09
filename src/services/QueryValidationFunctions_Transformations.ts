// import { QueryValidationResultFlag as F } from "./IQueryValidator";
// import { MFIELDS_COURSES, MFIELDS_ROOMS } from "../query_schema/MFields";
// import { InsightDatasetKind, InsightDataset } from "../controller/IInsightFacade";
// import { parseKeystring } from "./QueryValidationFunctions_Body";
// import { SFIELDS_COURSES, SFIELDS_ROOMS } from "../query_schema/SFields";
// import { IParsedData } from "../data/IParsedData";

// /**
//  * @returns [ResultFlag, string array of applykeys if valid, and the ID of the query]
//  */
// export function validateTransformations(t: any, datasets: InsightDataset[]): [F, string[], string] {
//     // Always has a group, always has an apply
//     if (t == null || typeof t !== "object") {
//         return [F.TransformationsIsNotAnObject, null, null];
//     }
//     const keys = Object.keys(t);
//     if (!keys.includes("GROUP")) {
//         return [F.TransformationsIsMissingGroup, null, null];
//     }
//     if (!keys.includes("APPLY")) {
//         return [F.TransformationsIsMissingGroup, null, null];
//     }
//     if (keys.length !== 2) {
//         return [F.TransformationsDoesntHaveTwoKeys, null, null];
//     }
//     const [gRes, id]: [F, string] = validateGroup(t.GROUP, datasets);
//     if (gRes !== F.Valid) {
//         return [gRes, null, null];
//     }
//     const [aRes, applyKeys, idFromApplykeys]: [F, string[], string] = validateApply(t.APPLY, id, kind);
//     if (aRes !== F.Valid) {
//         return [aRes, null, null];
//     }

//     if (id !== idFromApplykeys) {
//         return [F.MoreThanOneId, null, null];
//     }
//     // All checks passed
//     return [F.Valid, applyKeys, id];
// }

// export function validateGroup(g: any, ds: InsightDataset[]): F {
//     if (!Array.isArray(g)) {
//         return F.GroupIsNotAnArray;
//     }
//     if (g.length === 0) {
//         return F.GroupMustBeNonEmptyArray;
//     }
//     let id: string;
//     for (const k of g) {
//         if (!validateKey(k, ds)) {
//             return F.InvalidKey;
//         }
//     }
//     return F.Valid;
// }

// export function validateKey(k: any, ds: InsightDataset[]): boolean {
//     const res: [F, string, string] = parseKeystring(k);
//     if (res[0] !== F.Valid) {
//         return false;
//     }
//     const parsedId = res[1];
//     const field = res[2];
//     switch (kind) {
//         case InsightDatasetKind.Courses:
//             return MFIELDS_COURSES.includes(field) || SFIELDS_COURSES.includes(field);
//         case InsightDatasetKind.Rooms:
//             return MFIELDS_ROOMS.includes(field) || SFIELDS_ROOMS.includes(field);
//     }
// }

// /*
//  * APPLY ::= 'APPLY: [' (APPLYRULE (', ' APPLYRULE )* )? ']'
//  * APPLYRULE ::= '{' applykey ': {' APPLYTOKEN ':' key '}}'
//  * APPLYTOKEN ::= 'MAX' | 'MIN' | 'AVG' | 'COUNT' | 'SUM'
//  */
// /**
//  * @returns [ResultFlag, string array of applykeys if valid]
//  */
// export function validateApply(a: any, id: string, kind: InsightDatasetKind): [F, string[]] {
//     if (!Array.isArray(a)) {
//         return [F.ApplyIsNotAnArray, null];
//     }
//     if (a.length === 0) {
//         return [F.ApplyMustBeNonEmptyArray, null];
//     }
//     const applyKeys: string[] = [];

//     // Iterate through the ApplyRules array
//     for (const ar of a) {
//         // check if it's an object
//         // APPLYRULE
//         if (ar == null || typeof ar !== "object") {
//             return [F.ApplyRuleMustBeAnObject, null];
//         }
//         // check how many keys it has
//         if (Object.keys(ar).length !== 1) {
//             return [F.ApplyRuleMustHaveExactlyOneKey, null];
//         }
//         // applykey
//         const applyKey = Object.keys(ar)[0];
//         if (applyKeys.includes(applyKey)) {
//             return [F.ApplyKeysMustBeUnique, null];
//         }
//         applyKeys.push(applyKey);
//         const applyKeyValue: any = Object.values(ar)[0];
//         if (applyKeyValue == null || typeof applyKeyValue !== "object") {
//             return [F.ApplyKeyValueMustBeObject, null];
//         }
//         const akvKeys = Object.keys(applyKeyValue);
//         if (akvKeys.length !== 1) {
//             return [F.ApplyKeyValueMustHaveOneKey, null];
//         }
//         if (!APPLYTOKENS.includes(akvKeys[0])) {
//             return [F.ApplyKeyValueMustHaveApplyTokenKey, null];
//         }
//         // APPLYTOKEN
//         const key = Object.values(applyKeyValue)[0];
//         if (!validateKeyForApplyToken(key, id, kind, akvKeys[0])) {
//             return [F.ApplyKeyKeyTokenHasInvalidKey, null];
//         }
//     }
//     // The entire array is fine
//     return [F.Valid, applyKeys];
// }

// export function validateKeyForApplyToken(key: any, id: string, kind: InsightDatasetKind, token: string) {
//     if (!validateKey(key, id, kind)) {
//         return false;
//     }
//     // COUNT works for both SFields and MFields, but the rest only work for MFields
//     if (token === "COUNT") {
//         return true;
//     } else {
//         const field = key.split("_")[1];
//         // Don't need to check whether it belongs to courses or rooms because validateKey already does that
//         return MFIELDS_COURSES.includes(field) || MFIELDS_ROOMS.includes(field);
//     }
// }
