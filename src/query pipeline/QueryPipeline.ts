import { AllData } from "../data/AllData";
import { InsightError } from "../controller/IInsightFacade";
import { transformationsPipeline } from "./TransformationsPipeline";
import { filteringPipeline } from "./FilteringPipeline";

/**
 * Entry stage for general query pipeline
 * Each stage consists of a validation stage followed by processing stage
 *
 * @throws InsightError
 *
 * Validation:
 * - Too many keys in query
 * - Lack of WHERE object, OPTIONS object
 * - that TRANSFORMATIONS, if present is an object
 *
 * Processing:
 * - Filtering Stage
 *
 * @param q query JSON object from InsightFacade.performQuery
 * @param allData datasets from DatasetManager
 */
export const queryPipeline = (q: any, allData: AllData): any[] => {
    // Validation
    const keys = Object.keys(q);
    if (keys.length > 3) {
        invalid("Too many keys");
    }

    const where = q.WHERE;
    if (!where || typeof where !== "object") {
        invalid("WHERE: missing or not object");
    }

    const options = q.OPTIONS;
    if (!options || typeof options !== "object") {
        invalid("OPTIONS: missing or not object");
    }

    const transformations = q.TRANSFORMATIONS;
    if (transformations && typeof transformations !== "object") {
        invalid("TRANSFORMATIONS: present but not object");
    }

    if (!transformations) {
        if (keys.length > 2) {
            invalid("Too many keys (no transformations)");
        }
    }

    // Processing
    return filteringPipeline(q, allData);
};

/**
 * @throws InsightError for invalid query
 *
 * @param reason why the query is invalid
 */
export const invalid = (reason: string): void => {
    throw new InsightError("INVALID QUERY: " + reason);
};
