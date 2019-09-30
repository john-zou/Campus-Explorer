import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { isObject } from "util";
import { NotImplementedError } from "restify";
import { mfields as MFields } from "../query_schema/MFields";

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
        // "WHERE" must be a good filter
        const filterValidationResult: [F, string] = this.validateFilter(where, datasetIds);
    }

    private validateFilterArray(filters: any[], datasetIds: string[]): [F, string] {
        // Check that all the ID strings are the same, then return it along with a "Valid"
        if (!filters || filters.length === 0) {
            return [F.WrongType_LogicComparison, null];
        }
        let result: [F, string] = this.validateFilter(filters[0], datasetIds);
        if (result[0] !== F.Valid) {
            return result;
        }
        for (let i = 1; i < filters.length; ++i) {
            let nextResult: [F, string] = this.validateFilter(filters[i], datasetIds);
            if (nextResult[0] !== F.Valid) {
                return nextResult;
            }
            if (nextResult[1] !== result[1]) {
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
        throw new NotImplementedError();
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
        const parseResult = this.parseKeystring(key);
        const parseResultFlag = parseResult[0];
        if (parseResultFlag !== F.Valid) {
            return [parseResultFlag, ""];
        }
        const id = parseResult[1];
        if (!datasetIds.includes(id)) {
            return [F.IdDoesNotExist, ""];
        }
        const mfield = parseResult[2];
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
