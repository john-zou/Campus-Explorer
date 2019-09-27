import { IQueryValidator } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export class QueryValidator implements IQueryValidator {
    validate(json: any, kind: InsightDatasetKind): boolean {

        throw new Error("Method not implemented.");
    }
}
