import { OwensReality } from "../../data/OwensReality";
import { QueryValidationResultFlag } from "../../services/IQueryValidator";
import { InsightError, InsightDatasetKind, ResultTooLargeError } from "../../controller/IInsightFacade";
import { f } from "./Filter";
import { transform } from "./Transform";
import { dontTransform } from "./DontTransform";
import { getIdIfValid } from "./Validate";

export async function realize(q: any, owen: OwensReality): Promise<any[]> {
    const id = getIdIfValid(q, owen);
    const d = owen.getDataset(id);
    let things;

    switch (d.Kind) {
        case InsightDatasetKind.Courses:
            things = d.Sections;
            break;
        case InsightDatasetKind.Rooms:
            things = d.Rooms;
            break;
    }

    if (Object.keys(q.WHERE).length === 0) {
        if (things.length > 5000) {
            throw new ResultTooLargeError("IT'S OVER 5000!!!");
        }
    } else {
        const ff = [];
        for (const thing of things) {
            if (f(thing, q.WHERE)) {
                ff.push(thing);
            }
        }

        if (ff.length > 5000) {
            throw new ResultTooLargeError("IT'S OVER 5000!!!");
        }

        things = ff;
    }

    if (q.TRANSFORMATIONS !== undefined) {
        return transform(q, things);
    } else {
        return dontTransform(q, things);
    }
}
