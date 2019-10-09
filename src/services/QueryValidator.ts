// import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
// import { InsightDatasetKind as IDK, InsightDataset, InsightDatasetKind } from "../controller/IInsightFacade";
// import { validateFilter, parseKeystring, hasTooManyKeys, isMissingKey } from "./QueryValidationFunctions_Body";
// import { validateOptions } from "./QueryValidationFunctions_Options";
// import { validateQueryPreliminary as validateQueryKeys } from "./QueryValidationFunctions_Common";
// import { validateTransformations } from "./QueryValidationFunctions_Transformations";
// import { OwensReality } from "../data/OwensReality";

// export class QueryValidator implements IQueryValidator {

//     public validate(query: any, owen: OwensReality): R {
//         // Make sure the query is not null/undefined, is an object,
//         // has WHERE and OPTIONS, and doens't have anything else other than
//         // TRANSFORMAITONS
//         const [result, hasTransformations]: [F, boolean] = validateQueryKeys(query);
//         if (result !== F.Valid) {
//             return new R(result); // Pass along the bad news
//         }

//         if (hasTransformations) {
//             const res = validateTransformations(query.TRANSFORMATIONS, owen);

//             // TODO
//         }

//         let whereMentionsId: boolean = false;
//         let id: string = "";
//         // if .WHERE is not just empty object { }
//         if (Object.keys(query.WHERE).length !== 0) {
//             // .WHERE must be a good filter
//             const filterValidationResult: [F, string] = validateFilter(query.WHERE, datasetIds, kind);
//             const filterValidationFlag: F = filterValidationResult[0];
//             if (filterValidationFlag !== F.Valid) {
//                 return new R(filterValidationFlag);
//             }
//             // This ID is guaranteed to be in datasetIds
//             id = filterValidationResult[1]; // Remember the ID to compare with options
//             whereMentionsId = true; // This ID will then be matched against that from options
//         }
//         // Validate Options
//         const optionsValidationResult: [F, string] = validateOptions(query.OPTIONS, datasetIds, kind);
//         const optionsValidationFlag: F = optionsValidationResult[0];
//         if (optionsValidationFlag !== F.Valid) {
//             return new R(optionsValidationFlag);
//         }
//         // This ID is guaranteed to be in datasetIDs as well but it doesn't matter since
//         // it will be compared to the ID from earlier
//         const idFromOptions: string = optionsValidationResult[1];
//         if (whereMentionsId) { // Compare the IDs from both parts of the query
//             if (id !== idFromOptions) {
//                 return new R(F.MoreThanOneId);
//             }
//         }



//         return new R(F.Valid, idFromOptions);
//     }
// }
