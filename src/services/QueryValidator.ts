import { IQueryValidator, QueryValidationResult } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export class QueryValidator implements IQueryValidator {
    validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult {

        throw new Error("Method not implemented.");
    }
}
