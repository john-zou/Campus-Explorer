import { InsightDatasetKind } from "../controller/IInsightFacade";

export interface IQueryValidator {
    // Takes in a JSON and datasetkind and returns whether it's valid
    validate(json: any, kind: InsightDatasetKind): boolean;
}
