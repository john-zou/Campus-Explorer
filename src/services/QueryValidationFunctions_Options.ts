// import { QueryValidationResultFlag as F } from "./IQueryValidator";
// import { MFIELDS_COURSES as MFields } from "../query_schema/MFields";
// import { SFIELDS_COURSES as SFields } from "../query_schema/SFields";
// import { hasTooManyKeys, parseKeystring } from "./QueryValidationFunctions_Body";
// import { InsightDatasetKind } from "../controller/IInsightFacade";

// export function validateOptions(options: any,
//                                 datasetIds: string[],
//                                 kind: InsightDatasetKind): [F, string] {
//     // Check that options is an object
//     if (options == null || typeof options !== "object") {
//         return [F.WrongType_Options, null];
//     }
//     // Check that options contains column key
//     if (!Object.keys(options).includes("COLUMNS")) {
//         return [F.MissingColumns, null];
//     }
//     // Check whether options contains order key
//     const orderExists: boolean = Object.keys(options).includes("ORDER");
//     // Check for too many keys in options
//     if (orderExists) {
//         // Ensure there are no more than 2 keys
//         if (hasTooManyKeys(options, 2)) {
//             return [F.TooManyKeys_Options, null];
//         }
//     } else { // COLUMNS must be the only key
//         if (hasTooManyKeys(options, 1)) {
//             return [F.TooManyKeys_Options, null];
//         }
//     }
//     const columnsValidationResult: [F, string, string[]] =
//         validateColumns(options.COLUMNS, datasetIds);
//     const columnsValidationResultFlag: F = columnsValidationResult[0];
//     if (columnsValidationResultFlag !== F.Valid) {
//         return [columnsValidationResultFlag, null];
//     }
//     const columnsValidationResultId: string = columnsValidationResult[1];
//     // Check the order if it exists. Otherwise, return the columnsValidationResult.
//     if (orderExists) {
//         const columnFields: string[] = columnsValidationResult[2];
//         const order: any = options.ORDER;
//         const orderValidationResult: F =
//             validateOrder(order, columnsValidationResultId, datasetIds, columnFields);
//         if (orderValidationResult !== F.Valid) {
//             return [orderValidationResult, null];
//         }
//         return [orderValidationResult, columnsValidationResultId];
//     } else {
//         return [columnsValidationResultFlag, columnsValidationResultId];
//     }
// }

// // the datasetIds are passed for more descriptive invalid result flag
// export function validateOrder(orderValue: any,
//                               idFromColumns: string,
//                               datasetIds: string[],
//                               fieldsFromColumns: string[]): F {
//     if (orderValue == null || typeof orderValue !== "string") {
//         return F.WrongType_Order;
//     }
//     const parseResult: [F, string, string] = parseKeystring(orderValue);
//     const parseResultFlag: F = parseResult[0];
//     if (parseResultFlag !== F.Valid) {
//         return parseResultFlag;
//     }
//     const idString: string = parseResult[1];
//     if (idString.length === 0) {
//         return F.NoIdstring;
//     }
//     if (!datasetIds.includes(idString)) {
//         return F.IdDoesNotExist;
//     }
//     if (idString !== idFromColumns) {
//         return F.MoreThanOneId;
//     }
//     const field: string = parseResult[2];
//     if (field.length === 0) {
//         return F.EmptyField;
//     }
//     if (!(SFields.includes(field) || MFields.includes(field))) {
//         return F.OrderContainsInvalidField;
//     }
//     if (!fieldsFromColumns.includes(field)) {
//         return F.OrderContainsFieldNotInColumns;
//     }
//     // Otherwise, the order is fine
//     return F.Valid;
// }

// export function validateColumns(cols: any, datasetIds: string[]): [F, string, string[]] {
//     // Check if columns is an array
//     if (!(Array.isArray(cols))) {
//         return [F.ColumnsIsNotNonEmptyArray, null, null];
//     }
//     // Check if columns is empty
//     if (cols.length === 0) {
//         return [F.ColumnsIsNotNonEmptyArray, null, null];
//     }
//     // Return the result of checking each string
//     return validateColumnStrings(cols, datasetIds);
// }

// /**
//  * @param cols must be a non-empty array (otherwise it may give wrong invalid flag (but daijoubu))
//  */
// export function validateColumnStrings(cols: any[], datasetIds: string[]): [F, string, string[]] {
//     // Check the first item
//     const firstItem: any = cols[0];
//     if (firstItem == null || typeof firstItem !== "string") {
//         return [F.ColumnsContainsWrongType, null, null];
//     }
//     const firstResult: [F, string, string] = validateColumnString(firstItem, datasetIds);
//     const firstResultFlag: F = firstResult[0];
//     if (firstResult[0] !== F.Valid) {
//         return [firstResultFlag, null, null];
//     }
//     // The field is guaranteed to be in MFields or SFields
//     const firstId: string = firstResult[1];
//     let fields: string[] = [firstId];
//     // Iterate through the rest
//     for (let i = 1; i < cols.length; ++i) {
//         const result: [F, string, string] = validateColumnString(cols[i], datasetIds);
//         const resultFlag: F = result[0];
//         if (resultFlag !== F.Valid) {
//             return [resultFlag, null, null];
//         }
//         const resultId: string = result[1];
//         if (firstId !== resultId) {
//             return [F.MoreThanOneId, null, null];
//         }
//         const resultField: string = result[2];
//         if (!fields.includes(resultField)) {
//             fields.push(resultField);
//         }
//     }
//     return [F.Valid, firstId, fields];
// }

// export function validateColumnString(str: string, datasetIds: string[]): [F, string, string] {
//     const parseResult: [F, string, string] = parseKeystring(str);
//     const parseResultFlag: F = parseResult[0];
//     if (parseResultFlag !== F.Valid) {
//         return [parseResultFlag, null, null];
//     }
//     const id: string = parseResult[1];
//     if (id.length === 0) {
//         return [F.NoIdstring, null, null];
//     }
//     if (!datasetIds.includes(id)) {
//         return [F.IdDoesNotExist, null, null];
//     }
//     const field: string = parseResult[2];
//     if (field.length === 0) {
//         return [F.EmptyField, null, null];
//     }
//     if (!(SFields.includes(field) || MFields.includes(field))) {
//         return [F.ColumnContainsInvalidField, null, null];
//     }
//     return [F.Valid, id, field];
// }
