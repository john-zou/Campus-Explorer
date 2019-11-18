import { AllData } from "../../data/AllData";
import { hasTransformations } from "../../services/QueryValidationFunctions_Common";
import { getIdFromFilter } from "../../services/QueryValidationFunctions_Body";
import { getKeysFromTransformations } from "../../services/QueryValidationFunctions_Transformations";
import { validateOptions } from "../../services/QueryValidationFunctions_Options";
import { WT } from "../../util/Insight";
import { QueryValidationResultFlag } from "../../services/IQueryValidator";

/**
 * Throws InsightError if query is invalid for any reason
 */
export function getIdIfValid(query: any, owen: AllData): string {
    const hasT = hasTransformations(query);
    let idW: string;

    if (Object.keys(query.WHERE).length !== 0) {
        idW = getIdFromFilter(query.WHERE, owen);
    }

    let idQ: string;
    if (hasT) {
        // groupFields have leading _
        let [idT, groupFields, applyKeys]: [string, string[], string[]]  = getKeysFromTransformations(query, owen);
        if (idW !== undefined && idT !== idW) {
            WT(QueryValidationResultFlag.MoreThanOneId);
        }
        // groupFields have leading _
        validateOptions(query, owen, true, idT, groupFields, applyKeys);
        idQ = idT;
    } else {
        let idO = validateOptions(query, owen, false);
        if (idW !== undefined && idO !== idW) {
            WT(QueryValidationResultFlag.MoreThanOneId);
        }
        idQ = idO;
    }

    return idQ;
}
