import { InsightDatasetKind } from "../controller/IInsightFacade";
import { QueryValidationResult as R, QueryValidationResultFlag as F } from "../services/IQueryValidator";
import { hasTooManyKeys } from "./QueryValidationFunctions_Body";

export function validateQueryPreliminary(query: any, kind: InsightDatasetKind): [F, boolean] {
    const keys: string[] = Object.keys(query);
    if (!keys.includes("WHERE")) {
        return [F.MissingBody, false];
    }
    if (!keys.includes("OPTIONS")) {
        return [F.MissingOptions, false];
    }
    let hasTransfomations: boolean = keys.includes("TRANSFORMATIONS");
    let maxKeys: number = 2;
    if (hasTransfomations) {
        maxKeys = 3;
    }
    if (hasTooManyKeys(query, maxKeys)) {
        return [F.TooManyKeys_Query, false];
    }
    return [F.Valid, hasTransfomations];
}
