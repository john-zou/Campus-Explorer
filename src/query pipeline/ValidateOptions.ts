import { invalid } from "./QueryPipeline";
import { AllData } from "../data/AllData";
import { IDHolder } from "./IDHolder";
import { validateKey } from "./ValidateKey";

export const validateOptions = (query: any,
                                allData: AllData,
                                idHolder: IDHolder,
                                isTransformed = false,
                                groupKeys: string[] = null,
                                applyKeys: string[] = null): void => {
    // Check to make sure options is what we think it will be
    const options = query.OPTIONS;
    const optionKeys: string[] = Object.keys(options);
    if (optionKeys.length === 0) {
        invalid("OPTIONS empty");
    }
    if (optionKeys.length > 2) {
        invalid("OPTIONS can only contain order and columns");
    }

    // Validation of Columns
    const columns = query.OPTIONS.COLUMNS;
    if (!Array.isArray(columns) || columns.length === 0) {
        invalid("COLUMNS must be inhabited array");
    }
    if (isTransformed) {
        for (const column of columns) {
            if (groupKeys.includes(column) || applyKeys.includes(column)) {
                continue;
            } else {
                invalid("COLUMNS contains something not in groups/applykeys");
            }
        }
    } else {
        for (const column of columns) {
            validateKey(column, allData, idHolder);
        }
    }

    const shouldHaveOrder: boolean = (optionKeys.length === 2);
    if (!optionKeys.includes("ORDER") && shouldHaveOrder) {
        invalid("OPTIONS contains invalid field");
    }

    if (shouldHaveOrder) {
        const order = query.OPTIONS.ORDER;
        validateOrder(order, columns);
    }
};

const validateOrder = (order: any, columns: string[]): void => {
    if (!order) {
        invalid("ORDER cannot be null");
    }
    if (typeof order === "string") {
        if (!columns.includes(order)) {
            invalid("ORDER cannot sort by something not in columns");
        }
    } else if (typeof order === "object") {
        validateOrderObject(order, columns);
    } else {
        invalid("ORDER must be an orderkey or an orderobject");
    }
};

// SORT ::= 'ORDER: ' ('{ dir:'  DIRECTION ', keys: [ ' ORDERKEY (',' ORDERKEY)* ']}') | ORDERKEY
const validateOrderObject = (order: any, columns: string[]): void => {
    const keys = Object.keys(order);
    if (keys.length !== 2) {
        invalid("");
    }
    if (!keys.includes("dir")) {
        invalid("");
    }
    if (!keys.includes("keys")) {
        invalid("");
    }
    if (order.dir !== "UP" && order.dir !== "DOWN") {
        invalid("");
    }
    if (!Array.isArray(order.keys)) {
        invalid("");
    }
    if (order.keys.length === 0) {
        invalid("");
    }
    for (const item of order.keys) {
        if (!columns.includes(item)) {
            invalid("");
        }
    }
};
