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
 * @param query query json object
 * @param owen the super saiyan of data
 */
export async function realize(query: any, owen: OwensReality): Promise<any[]> {
    const id = getIdIfValid(query, owen);
    const dataset = owen.getDataset(id);
    let things; // will be Rooms or Sections depending on the query's ID

    // Set things to either Sections or Rooms
    switch (dataset.Kind) {
        case InsightDatasetKind.Courses:
            things = dataset.Sections;
            break;
        case InsightDatasetKind.Rooms:
            things = dataset.Rooms;
            break;
    }

    const hasTransformations: boolean = query.TRANSFORMATIONS != null;
    const hasFilter: boolean = Object.keys(query.WHERE).length !== 0;

    // If there is no filter and no transformations, then we can check the size now for ResultTooLarge
    if (!hasFilter) {
        if (!hasTransformations) {
            if (things.length > 5000) {
                throw new ResultTooLargeError("WHERE {}, no transformations, and over 5000");
            }
        }
    } else { // has filter. So, filter the things
        const filteredThings = [];
        for (const thing of things) {
            if (f(thing, query.WHERE)) {
                filteredThings.push(thing);
            }
        }

        if (!hasTransformations) { // If there aren't transformations, check the size for ResultTooLarge
            if (filteredThings.length > 5000) {
                throw new ResultTooLargeError("no transformations, over 5000 after filtering");
            }
        }

        things = filteredThings;
    }

    if (hasTransformations) {
        let res = transform(query, things);
        return res;
    } else {
        return dontTransform(query, things);
    }
}
