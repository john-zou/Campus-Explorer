import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { isObject } from "util";
import { NotImplementedError } from "restify";
import { mfields as MFields } from "../query_schema/MFields";
import { sfields as SFields } from "../query_schema/SFields";

export class QueryValidator implements IQueryValidator {
    public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): R {
        // Highest level checks
        if (this.isMissingKey(json, "WHERE")) {
            return new R(F.MissingBody);
        }
        if (this.isMissingKey(json, "OPTIONS")) {
            return new R(F.MissingOptions);
        }
        if (this.hasTooManyKeys(json, 2)) {
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
            const filterValidationResult: [F, string] = this.validateFilter(where, datasetIds);
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
            if (this.hasTooManyKeys(options, 2)) {
                return [F.TooManyKeys_Options, null];
            }
        } else {
            if (this.hasTooManyKeys(options, 1)) {
                return [F.TooManyKeys_Options, null];
            }
        }
        // TODO: check the columns and order (make sure order is in columns)
    }

    private validateFilterArray(filters: any[], datasetIds: string[]): [F, string] {
        // Check that all the ID strings are the same, then return it along with a "Valid"
        if (!filters || filters.length === 0) {
            return [F.WrongType_LogicComparison, null];
        }
        // Essentially, folds the validateFilter results into one, making sure they are
        // all valid and all have the same ID.
        let result: [F, string] = this.validateFilter(filters[0], datasetIds);
        if (result[0] !== F.Valid) {
            return result;
        }
        for (let i = 1; i < filters.length; ++i) {
            let nextResult: [F, string] = this.validateFilter(filters[i], datasetIds);
            if (nextResult[0] !== F.Valid) {
                return nextResult;
            }
            if (nextResult[1] !== result[1]) { // verify they have the same ID
                return [F.MoreThanOneId, ""];
            }
        }
        return result;
    }

    private validateFilter(filter: any, datasetIds: string[]): [F, string]  {
        if (this.hasTooManyKeys(filter, 1)) {
            return [F.TooManyKeys_Filter, null];
        }
        const key = Object.keys(filter)[0];
        switch (key) {
            case "AND":
                return this.validateFilterArray(filter.AND, datasetIds);
            case "OR":
                return this.validateFilterArray(filter.OR, datasetIds);
            case "NOT":
                return this.validateFilter(filter.NOT, datasetIds);
            case "LT":
                return this.validateMComparison(filter.LT, datasetIds);
            case "GT":
                return this.validateMComparison(filter.GT, datasetIds);
            case "EQ":
                return this.validateMComparison(filter.EQ, datasetIds);
            case "IS":
                return this.validateSComparison(filter.IS, datasetIds);
            default:
                return [F.WrongKey_Filter, null];
        }
    }

    private validateSComparison(sc: any, datasetIds: string[]): [F, string] {
        if (sc == null || typeof sc !== "object") {
            return [F.WrongType_SComparison, null];
        }
        if (this.hasTooManyKeys(sc, 1)) {
            return [F.TooManyKeys_SComparison, null];
        }
        const key: string = Object.keys(sc)[0];
        const parseResult: [F, string, string] = this.parseKeystring(key);
        const parseResultFlag: F = parseResult[0];
        if (parseResultFlag !== F.Valid) {
            return [parseResultFlag, ""];
        }
        const id: string = parseResult[1];
        if (!datasetIds.includes(id)) {
            return [F.IdDoesNotExist, ""];
        }
        const sfield: string = parseResult[2];
        if (!SFields.includes(sfield)) {
            return [F.InvalidSField, ""];
        }
        // Validate the value -- it must be a number
        const value: any = Object.values(sc)[0];
        if (value == null || typeof value !== "number") {
            return [F.MValueNotANumber, ""];
        }
        // It's valid!
        return [F.Valid, id];
    }

    private validateMComparison(mc: any, datasetIds: string[]): [F, string] {
        // Validate the key
        if (mc == null || typeof mc !== "object") {
            return [F.WrongType_MComparison, null];
        }
        if (this.hasTooManyKeys(mc, 1)) {
            return [F.TooManyKeys_MComparison, null];
        }
        const key: string = Object.keys(mc)[0];
        const parseResult: [F, string, string] = this.parseKeystring(key);
        const parseResultFlag: F = parseResult[0];
        if (parseResultFlag !== F.Valid) {
            return [parseResultFlag, ""];
        }
        const id: string = parseResult[1];
        if (!datasetIds.includes(id)) {
            return [F.IdDoesNotExist, ""];
        }
        const mfield: string = parseResult[2];
        if (!MFields.includes(mfield)) {
            return [F.InvalidMfield, ""];
        }
        // Validate the value -- it must be a number
        const value: any = Object.values(mc)[0];
        if (value == null || typeof value !== "number") {
            return [F.MValueNotANumber, ""];
        }
        // It's valid!
        return [F.Valid, id];
    }

    private parseKeystring(str: string): [F, string, string] {
        let ss: string[] = str.split("_");
        if (ss.length === 1) {
            return [F.NoUnderscore, null, null];
        }
        if (ss.length > 2) {
            return [F.TooManyUnderscores, null, null];
        }
        return [F.Valid, ss[0], ss[1]];
    }

    private hasTooManyKeys(json: any, max: number) {
        return Object.keys(json).length > max;
    }

    private isMissingKey(json: any, key: string): boolean {
        return !Object.keys(json).includes(key);
    }
}
