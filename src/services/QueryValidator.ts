import { IQueryValidator, QueryValidationResult } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export class QueryValidator implements IQueryValidator {
    validate(json: any, kind: InsightDatasetKind): QueryValidationResult {

        throw new Error("Method not implemented.");
    }
}
