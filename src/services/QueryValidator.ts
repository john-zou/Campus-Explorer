import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { isObject } from "util";
import { NotImplementedError } from "restify";
import { mfields as MFields } from "../query_schema/MFields";
import { sfields as SFields } from "../query_schema/SFields";
import { validateFilter, parseKeystring, hasTooManyKeys, isMissingKey } from "./QueryValidationFunctions";

export class QueryValidator implements IQueryValidator {
    public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): R {
        // Highest level checks
        if (isMissingKey(json, "WHERE")) {
            return new R(F.MissingBody);
        }
        if (isMissingKey(json, "OPTIONS")) {
            return new R(F.MissingOptions);
        }
        if (hasTooManyKeys(json, 2)) {
            return new R(F.TooManyKeys_Query);
        }
        // WrongType_Body -- BODY in EBNF is property WHERE
        const where = json.WHERE;
        if (where == null || typeof where !== "object") {
            return new R(F.WrongType_Body);
        }
        // WrongType_Options
        const options = json.OPTIONS;
        if (options == null || typeof options !== "object") {
            return new R(F.WrongType_Options);
        }
        // if "WHERE" is not just { }
        let whereMentionsId: boolean = false;
        let id: string = "";
        if (Object.keys(where).length !== 0) {
            // "WHERE" must be a good filter
            const filterValidationResult: [F, string] = validateFilter(where, datasetIds);
            const filterValidationFlag: F = filterValidationResult[0];
            if (filterValidationFlag !== F.Valid) {
                return new R(filterValidationFlag);
            }
            whereMentionsId = true;
            id = filterValidationResult[1]; // Remember the ID to compare with options
        }
        // Validate Options
        const optionsValidationResult: [F, string] = this.validateOptions(options, datasetIds);
        const optionsValidationFlag: F = optionsValidationResult[0];
        if (optionsValidationFlag !== F.Valid) {
            return new R(optionsValidationFlag);
        }
        const idFromOptions: string = optionsValidationResult[1];
        if (whereMentionsId) {
            if (id !== idFromOptions) {
                return new R(F.MoreThanOneId);
            }
        }
        return new R(F.Valid, idFromOptions);
    }
    private validateOptions(options: any, datasetIds: string[]): [F, string] {
        // Check that options is an object
        if (options == null || typeof options !== "object") {
            return [F.WrongType_Options, null];
        }
        // Check that options contains column key
        if (Object.keys(options).length === 0) {
            return [F.MissingColumns, null];
        }
        if (!Object.keys(options).includes("COLUMNS")) {
            return [F.MissingColumns, null];
        }
        // Check whether options contains order key
        const orderExists: boolean = Object.keys(options).includes("ORDER");
        // Check for too many keys in options
        if (orderExists) {
            // Ensure there are no more than 2 keys
            if (hasTooManyKeys(options, 2)) {
                return [F.TooManyKeys_Options, null];
            }
        } else {
            if (hasTooManyKeys(options, 1)) {
                return [F.TooManyKeys_Options, null];
            }
        }
        const columnsValidationResult: [F, string, string[]] =
            this.validateColumns(options.COLUMNS, datasetIds);
        const columnsValidationResultFlag: F = columnsValidationResult[0];
        if (columnsValidationResultFlag !== F.Valid) {
            return [columnsValidationResultFlag, null];
        }
        const columnsValidationResultId: string = columnsValidationResult[1];
        // Check the order if it exists. Otherwise, return the columnsValidationResult.
        if (orderExists) {
            const columnFields: string[] = columnsValidationResult[2];
            const order: any = options.ORDER;
            const orderValidationResult: F =
                this.validateOrder(order, columnsValidationResultId, datasetIds, columnFields);
            if (orderValidationResult !== F.Valid) {
                return [orderValidationResult, null];
            }
            return [orderValidationResult, columnsValidationResultId];
        } else {
            return [columnsValidationResultFlag, columnsValidationResultId];
        }
    }
    private validateOrder(order: any, cid: string, ids: string[], fields: string[]): F {
        if (order == null || typeof order !== "string") {
            return F.WrongType_Order;
        }
        const parseResult: [F, string, string] = parseKeystring(order);
        const parseResultFlag: F = parseResult[0];
        if (parseResultFlag !== F.Valid) {
            return parseResultFlag;
        }
        const id: string = parseResult[1];
        if (!ids.includes(id)) {
            return F.IdDoesNotExist;
        }
        if (id !== cid) {
            return F.MoreThanOneId;
        }
        const field: string = parseResult[2];
        if (SFields.includes(field) || MFields.includes(field)) {
            return F.OrderContainsInvalidField;
        }
        if (!fields.includes(field)) {
            return F.OrderContainsFieldNotInColumns;
        }
        // Otherwise, the order is fine
        return F.Valid;
    }
    private validateColumns(cols: any, datasetIds: string[]): [F, string, string[]] {
        // Check if columns is an array
        if (!(Array.isArray(cols))) {
            return [F.ColumnsIsNotNonEmptyArray, null, null];
        }
        // Check if columns is empty
        if (cols.length === 0) {
            return [F.ColumnsIsNotNonEmptyArray, null, null];
        }
        // Return the result of checking each string
        return this.validateColumnStrings(cols, datasetIds);
    }
    private validateColumnStrings(cols: any[], datasetIds: string[]): [F, string, string[]] {
        // Check the first item
        const firstItem: any = cols[0];
        if (firstItem == null || typeof firstItem !== "string") {
            return [F.ColumnsContainsWrongType, null, null];
        }
        const firstResult: [F, string, string] = this.validateColumnString(firstItem, datasetIds);
        const firstResultFlag: F = firstResult[0];
        if (firstResult[0] !== F.Valid) {
            return [firstResultFlag, null, null];
        }
        const firstId: string = firstResult[1];
        let fieldsArray: string[] = [firstId];
        // Iterate through the rest
        for (let i = 1; i < cols.length; ++i) {
            const result: [F, string, string] = this.validateColumnString(cols[i], datasetIds);
            const resultFlag: F = result[0];
            if (resultFlag !== F.Valid) {
                return [resultFlag, null, null];
            }
            const resultId: string = result[1];
            if (firstId !== resultId) {
                return [F.MoreThanOneId, null, null];
            }
            const resultField: string = result[2];
            if (!fieldsArray.includes(resultField)) {
                fieldsArray.push(resultField);
            }
        }
        return [F.Valid, firstId, fieldsArray];
    }

    private validateColumnString(str: string, datasetIds: string[]): [F, string, string] {
        const parseResult: [F, string, string] = parseKeystring(str);
        const parseResultFlag: F = parseResult[0];
        if (parseResultFlag !== F.Valid) {
            return [parseResultFlag, null, null];
        }
        const id: string = parseResult[1];
        if (!datasetIds.includes(id)) {
            return [F.IdDoesNotExist, null, null];
        }
        const field: string = parseResult[2];
        if (!(SFields.includes(field) || MFields.includes(field))) {
            return [F.ColumnContainsInvalidField, null, null];
        }
        return [F.Valid, id, field];
    }

}
