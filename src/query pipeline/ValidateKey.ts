import { AllData } from "../data/AllData";
import { invalid } from "./QueryPipeline";
import { IDCheckResult } from "../data/IDCheckResult";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import Insight from "../util/Insight";
import { SFIELDS_COURSES, SFIELDS_ROOMS } from "../query_schema/SFields";
import { MFIELDS_COURSES, MFIELDS_ROOMS } from "../query_schema/MFields";
import { IDHolder } from "./IDHolder";

/**
 * @throws InsightError
 * - Checks if key is string
 * - Checks against or sets id
 * - Checks field
 *
 * @param key
 * @param allData
 * @param holder Reference to IDHolder instance (used for checking for multiple ID error)
 */
export const validateKey =
(key: any, allData: AllData, holder: IDHolder, mustBeMKey: boolean = false, mustBeSKey: boolean = false): void => {
    if (!key || typeof key !== "string") {
        invalid("KEY: wrong type");
    }
    const split = (key as string).split("_");
    if (split.length !== 2) {
        invalid("KEY: invalid string");
    }
    const keyId = split[0];
    const keyField = split[1];

    // Check ID, including whether it matches a dataset
    checkID(keyId, holder, allData);

    // Check Field
    const dataset = allData.getDataset(keyId);
    const kind = dataset.Kind;
    checkField(keyField, kind, mustBeMKey, mustBeSKey);
};

const checkID = (id: string, idHolder: IDHolder, allData: AllData): void => {
    const idCheck = allData.checkID(id);
    if (idCheck === IDCheckResult.NotFound) {
        invalid("KEY: ID does not match any dataset");
    } else {
        idHolder.check(id);
    }
};

const checkField = (field: string, kind: InsightDatasetKind, mustBeMField: boolean, mustBeSField: boolean): void => {
    let sfields;
    let mfields;
    if (kind === InsightDatasetKind.Courses) {
        sfields = SFIELDS_COURSES;
        mfields = MFIELDS_COURSES;
    } else {
        sfields = SFIELDS_ROOMS;
        mfields = MFIELDS_ROOMS;
    }
    if (mustBeMField) {
        if (!mfields.includes(field)) {
            invalid("Invalid field (expected mfield)");
        }
        return;
    }
    if (mustBeSField) {
        if (!sfields.includes(field)) {
            invalid("Expected field (expected sfield)");
        }
        return;
    }

    // Can be either
    if (!mfields.includes(field) && !sfields.includes(field)) {
        invalid("Invalid field");
    }
};
