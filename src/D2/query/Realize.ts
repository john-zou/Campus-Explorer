import { OwensReality } from "../../data/OwensReality";
import { QueryValidationResultFlag } from "../../services/IQueryValidator";
import { InsightError, InsightDatasetKind, ResultTooLargeError } from "../../controller/IInsightFacade";
import { f } from "./Filter";
import { transform } from "./Transform";
import { dontTransform } from "./DontTransform";
import { QueryValidator } from "../../services/QueryValidator";

export async function realize(q: any, owen: OwensReality): Promise<any[]> {
    const vr = new QueryValidator().validate(q, owen);
    if (vr.Result !== QueryValidationResultFlag.Valid) {
        throw new InsightError(vr.Result);
    }
    const id = vr.ID;
    const d = owen.getDataset(id);
    let things;

    switch (d.Kind) {
        case InsightDatasetKind.Courses: things = d.Sections;
        case InsightDatasetKind.Rooms: things = d.Rooms;
    }

    if (Object.keys(q.WHERE).length === 0) {
        if (things.length > 5000) {
            throw new ResultTooLargeError("IT'S OVER 5000!!!");
        }
    }

    const ff = [];
    for (const thing of things) {
        if (f(thing, q.WHERE)) {
            ff.push(thing);
        }
    }

    if (ff.length > 5000) {
        throw new ResultTooLargeError("IT'S OVER 5000!!!");
    }

    if (q.TRANSFORMATIONS !== undefined) {
        return transform(q, ff);
    } else {
        return dontTransform(q, ff);
    }
}
