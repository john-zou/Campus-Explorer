import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { isObject } from "util";

export class QueryValidator implements IQueryValidator {
    public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): R {
        // Highest level checks
        if (this.isMissingKey(json, "BODY")) {
            return new R(F.MissingBody);
        }
        if (this.isMissingKey(json, "OPTIONS")) {
            return new R(F.MissingOptions);
        }
        if (this.hasTooManyKeys(json, 2)) {
            return new R(F.TooManyKeys_Query);
        }
        // WrongType_Body
        const body = json.BODY;
        if (body == null || typeof body !== "object") {
            return new R(F.WrongType_Body);
        }
    }

    private hasTooManyKeys(json: any, max: number) {
        return Object.keys(json).length > max;
    }

    private isMissingKey(json: any, key: string): boolean {
        return !Object.keys(json).includes(key);
    }
}
