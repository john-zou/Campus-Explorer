import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { isObject } from "util";
import { NotImplementedError } from "restify";

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
        const filterValidationResult = this.validateFilter(where, datasetIds);
    }

    private validateFilter(filter: any, datasetIds: string[]) {
        throw new NotImplementedError();
    }

    private hasTooManyKeys(json: any, max: number) {
        return Object.keys(json).length > max;
    }

    private isMissingKey(json: any, key: string): boolean {
        return !Object.keys(json).includes(key);
    }
}
