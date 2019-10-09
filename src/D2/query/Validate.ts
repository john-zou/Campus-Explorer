import { OwensReality } from "../../data/OwensReality";
import { hasTransformations } from "../../services/QueryValidationFunctions_Common";
import { getIdFromFilter } from "../../services/QueryValidationFunctions_Body";
import { getKeysFromTransformations } from "../../services/QueryValidationFunctions_Transformations";
import { validateOptions } from "../../services/QueryValidationFunctions_Options";
import { WT } from "../../util/Insight";
import { QueryValidationResultFlag } from "../../services/IQueryValidator";

/**
 * Throws InsightError if query is invalid for any reason
 */
export function getIdIfValid(q: any, owen: OwensReality): string {
    const hasT = hasTransformations(q);
    let id1: string;

    if (Object.keys(q.WHERE).length !== 0) {
        id1 = getIdFromFilter(q.WHERE, owen);
    }

    let id: string;
    if (hasT) {
        // groupFields have leading _
        let [id2, groupFields, applyKeys]: [string, string[], string[]]  = getKeysFromTransformations(q, owen);
        if (id1 !== undefined && id2 !== id1) {
            WT(QueryValidationResultFlag.MoreThanOneId);
        }
        // groupFields have leading _
        validateOptions(q, owen, true, id2, groupFields, applyKeys);
        id = id2;
    } else {
        let id2 = validateOptions(q, owen, false);
        if (id1 !== undefined && id2 !== id1) {
            WT(QueryValidationResultFlag.MoreThanOneId);
        }
        id = id2;
    }

    return id;
}
