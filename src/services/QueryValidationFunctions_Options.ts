import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES as MFields } from "../query_schema/MFields";
import { SFIELDS_COURSES as SFields } from "../query_schema/SFields";
import { hasTooManyKeys, parseKeystring } from "./QueryValidationFunctions_Body";
import { OwensReality } from "../data/OwensReality";
import { WT } from "../util/Insight";
import { verifyAndGetIdAndField } from "./QueryValidationFunctions_Transformations";

export function validateOptions(options: any,
                                owen: OwensReality,
                                transformed: boolean,
                                idFromTransformations?: string,
                                groupFields?: string[],
                                applyKeys?: string[]): string {
    // Check that options is an object
    if (options == null || typeof options !== "object") {
        WT(F.WrongType_Options);
    }
    // Check that options contains column key
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

    const THE_ONE_ID: string = transformed ? idFromNonTransformedColumns : idFromNonTransformedColumns;
    // Check the order
    if (orderExists) {
        const order: any = options.ORDER;
        validateOrder(order, options.COLUMNS);
    }
    // Valid!
    return THE_ONE_ID;
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

export function validateTransformedColumnStrings(cols: any[], owen: OwensReality, id: string, groupFields: string[],
                                                 applyKeys: string[]) {
    for (const c of cols) {
        if (c == null || typeof c !== "string") {
            WT(F.ColumnsContainsWrongType);
        }
        if (!c.includes("_")) {
            // applyKey
            if (!applyKeys.includes(c)) {
                WT(F.ColumnWithoutUnderscoreNotInApplyKeys);
            }
        } else {
            const [idd, field] = verifyAndGetIdAndField(c, owen);
            if (id !== idd) {
                WT(F.MoreThanOneId);
            }
            if (!groupFields.includes("_" + field)) {
                WT(F.ColumnContainsFieldNotInGroupFields);
            }
        }
    }
}

export function validateColumnsAndGetID(cols: any, owen: OwensReality): string {
    // Check if columns is an array
    if (!(Array.isArray(cols))) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }
    // Check if columns is empty
    if (cols.length === 0) {
        WT(F.ColumnsIsNotNonEmptyArray);
    }
    // Return the result of checking each string
    return validateColumnStringsAndGetID(cols, owen);
}

/**
 * @param cols must be a non-empty array (otherwise it may give wrong invalid flag (but daijoubu))
 */
export function validateColumnStringsAndGetID(cols: any[], owen: OwensReality): string {
    let id: string;
    for (const c of cols) {
        const [idd, _] = verifyAndGetIdAndField(c, owen);
        if (id === undefined) {
            id = idd;
            break;
        }
        if (id !== idd) {
            WT(F.MoreThanOneId);
        }
    }
    return id;
}
