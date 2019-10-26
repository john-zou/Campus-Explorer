import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES as MFields } from "../query_schema/MFields";
import { SFIELDS_COURSES as SFields } from "../query_schema/SFields";
import { hasTooManyKeys, parseKeystring } from "./QueryValidationFunctions_Body";
import { OwensReality } from "../data/OwensReality";
import { WT } from "../util/Insight";
import { verifyAndGetIdAndField } from "./QueryValidationFunctions_Transformations";

export function validateOptions(query: any,
                                owen: OwensReality,
                                transformed: boolean,
                                idFromTransformations?: string,
                                groupFields?: string[],
                                applyKeys?: string[]): string {
    // Check that options is an object
    const options = query.OPTIONS;
    if (options == null || typeof options !== "object") {
        WT(F.WrongType_Options);
    }
    // Check that options contains COLUMNS key
    if (!Object.keys(options).includes("COLUMNS")) {
        WT(F.MissingColumns);
    }
    // Check whether options contains order key
    const orderExists: boolean = Object.keys(options).includes("ORDER");
    // Check for too many keys in options
    if (orderExists) {
        // Ensure there are no more than 2 keys
        if (hasTooManyKeys(options, 2)) {
            WT(F.TooManyKeys_Options);
        }
    } else { // COLUMNS must be the only key
        if (hasTooManyKeys(options, 1)) {
            WT(F.TooManyKeys_Options);
        }
    }

    let idFromNonTransformedColumns: string;
    if (transformed) {
        validateTransformedColumns(options.COLUMNS, owen, idFromTransformations, groupFields, applyKeys);
    } else {
        idFromNonTransformedColumns = validateColumnsAndGetID(options.COLUMNS, owen);
    }
    let finalId: string;
    if (transformed) {
        finalId = idFromTransformations;
    } else {
        finalId = idFromNonTransformedColumns;
    }
    // Check the order
    if (orderExists) {
        const order: any = options.ORDER;
        validateOrder(order, options.COLUMNS);
    }
    // Valid!
    return finalId;
}

// the datasetIds are passed for more descriptive invalid result flag
export function validateOrder(order: any,
                              columns: string[]) {
    if (order == null) {
        WT(F.WrongType_Order);
    }
    if (typeof order === "string") {
        if (!columns.includes(order)) {
            WT(F.OrderNotInColumns);
        }
    } else if (typeof order === "object") {
        validateOrderObject(order, columns);
    } else {
        WT(F.WrongType_Order);
    }
}

// SORT ::= 'ORDER: ' ('{ dir:'  DIRECTION ', keys: [ ' ORDERKEY (',' ORDERKEY)* ']}') | ORDERKEY
export function validateOrderObject(order: any, columns: string[]) {
    const keys = Object.keys(order);
    if (keys.length !== 2) {
        WT(F.TooManyKeys_Order);
    }
    if (!keys.includes("dir")) {
        WT(F.OrderMissingDir);
    }
    if (!keys.includes("keys")) {
        WT(F.OrderMissingKeys);
    }
    if (order.dir !== "UP" && order.dir !== "DOWN") {
        WT(F.InvalidOrderDir);
    }
    if (!Array.isArray(order.keys)) {
        WT(F.OrderKeysIsNotNonEmptyArray);
    }
    if (order.keys.length === 0) {
        WT(F.OrderKeysIsNotNonEmptyArray);
    }
    for (const item of order.keys) {
        if (!columns.includes(item)) {
            WT(F.OrderContainsKeyNotInColumns);
        }
    }
}

function validateTransformedColumns(cols: any, owen: OwensReality,
                                    id: string,
                                    groupFields: string[],
                                    applyFields: string[]) {
    if (!(Array.isArray(cols))) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }
    // Check if columns is empty
    if (cols.length === 0) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }

    validateTransformedColumnStrings(cols, owen, id, groupFields, applyFields);
}

export function validateTransformedColumnStrings(columns: any[], owen: OwensReality, id: string, groupFields: string[],
                                                 applyKeys: string[]) {
    for (const columnKey of columns) {
        if (columnKey == null || typeof columnKey !== "string") {
            WT(F.ColumnsContainsWrongType);
        }
        if (!columnKey.includes("_")) {
            // applyKey
            if (!applyKeys.includes(columnKey)) {
                WT(F.ColumnWithoutUnderscoreNotInApplyKeys);
            }
        } else {
            const [idd, field] = verifyAndGetIdAndField(columnKey, owen);
            if (id !== idd) {
                WT(F.MoreThanOneId);
            }
            if (!groupFields.includes("_" + field)) {
                WT(F.ColumnContainsFieldNotInGroupFields);
            }
        }
    }
}

export function validateColumnsAndGetID(columns: any, owen: OwensReality): string {
    // Check if columns is an array
    if (!(Array.isArray(columns))) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }
    // Check if columns is empty
    if (columns.length === 0) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }
    // Return the result of checking each string
    return validateColumnStringsAndGetID(columns, owen);
}

/**
 * @param columns must be a non-empty array (otherwise it may give wrong invalid flag (but daijoubu))
 */
export function validateColumnStringsAndGetID(columns: any[], owen: OwensReality): string {
    let id: string;
    for (const column of columns) {
        const [idd, _] = verifyAndGetIdAndField(column, owen);
        if (id === undefined) {
            id = idd;
            continue;
        }
        if (id !== idd) {
            WT(F.MoreThanOneId);
        }
    }
    return id;
}
