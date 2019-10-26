import { OwensReality } from "../../data/OwensReality";
import { QueryValidationResultFlag } from "../../services/IQueryValidator";
import { InsightError, InsightDatasetKind, ResultTooLargeError } from "../../controller/IInsightFacade";
import { f } from "./Filter";
import { transform } from "./Transform";
import { dontTransform } from "./DontTransform";
import { getIdIfValid } from "./Validate";

/**
 * The query fulfillment pipeline:
 * Stages:
 *  1. getIdIfValid (Validate.ts)
 *  2. f (Filter.ts)
 *  3. transform (Transform.ts) || dontTransform (DontTransform.ts)
 *   (depending on whether TRANSFORMATIONS exists)
 *  4. sort (Sort.ts) via transform || dontTransform
 *
 * @param q query json object
 * @param owen the super saiyan of data
 */
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

    if (q.TRNASFORMATIONS === undefined && Object.keys(q.WHERE).length === 0) {
        if (things.length > 5000) {
            throw new ResultTooLargeError("WHERE {}, no transformations, and over 5000");
        }
    }

    if (Object.keys(q.WHERE).length !== 0)  {
        const ff = [];
        for (const thing of things) {
            if (f(thing, q.WHERE)) {
                ff.push(thing);
            }
        }

        if (q.TRANSFORMATIONS === undefined && ff.length > 5000) {
            throw new ResultTooLargeError("IT'S OVER 5000!!!");
        }

        things = ff;
    }

    if (q.TRANSFORMATIONS !== undefined) {
        let res = transform(q, things);
        if (res.length > 5000) {
            throw new ResultTooLargeError("OVER 5k groups!");
        }
        return res;
    } else {
        return dontTransform(q, things);
    }
}
