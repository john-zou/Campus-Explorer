import { InsightDatasetKind } from "../controller/IInsightFacade";

export enum QueryValidationResult {
    Valid, NotJSON, // todo: add more
}

export interface IQueryValidator {
    // Takes in a JSON and datasetkind and returns a validation result.
    validate(json: any, kind: InsightDatasetKind): QueryValidationResult;
}
