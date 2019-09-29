import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F }
    from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export class QueryValidator implements IQueryValidator {
    public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): R {
        if (this.isMissingKey(json, "BODY")) {
            return new R(F.MissingBody, null);
        }
        if (this.isMissingKey(json, "OPTIONS")) {
            return new R(F.MissingOptions, null);
        }
        // Next: Too many keys, etc.
    }

    private isMissingKey(json: any, key: string): boolean{
        return !Object.keys(json).includes(key);
    }
}
