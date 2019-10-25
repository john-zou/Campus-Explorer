import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { QueryValidationResult as R, QueryValidationResultFlag as F } from "../services/IQueryValidator";
import { hasTooManyKeys } from "./QueryValidationFunctions_Body";
import { WT } from "../util/Insight";

/**
 * throws InsightError if query is invalid at the highest level (WHERE, OPTIONS, TRANSFORMATIONS)
 */
export function hasTransformations(query: any): boolean {
    const keys: string[] = Object.keys(query);
    if (!keys.includes("WHERE")) {
        WT(F.MissingBody);
    }
    if (typeof query.WHERE !== "object") {
        WT(F.WrongType_Body);
    }
    if (!keys.includes("OPTIONS")) {
        WT(F.MissingOptions);
    }
    let hasT: boolean = keys.includes("TRANSFORMATIONS");
    let maxKeys: number = 2;
    if (hasT) {
        maxKeys = 3;
    }
    if (hasTooManyKeys(query, maxKeys)) {
        WT(F.TooManyKeys_Query);
    }
    return hasT;
}
