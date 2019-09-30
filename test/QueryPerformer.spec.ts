import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";
import { QueryPerformer } from "../src/services/QueryPerformer";
import TestUtil from "./TestUtil";
import Log from "../src/Util";
import { IQueryValidator, QueryValidationResultFlag, QueryValidationResult } from "../src/services/IQueryValidator";

describe("Perform Query Tests", () => {
    // ONLY tests valid queries
    // Constructing a new IParsedData to use in testing
    class ParsedDataT implements IParsedData {
        public data: [{ courses_dept: "epse", courses_avg: 97.19 },
                      { courses_dept: "math", courses_avg: 97.09 },
                      { courses_dept: "nurs", courses_avg: 98.21 },
                      { courses_dept: "epse", courses_avg: 97.08 },
                      { courses_dept: "cnps", courses_avg: 97.47 },
                      { courses_dept: "math", courses_avg: 97.25 },
                      { courses_dept: "spph", courses_avg: 98.98 }];
        public id: "test";
        public kind: InsightDatasetKind.Courses;
        public numRows: 2;
    }
    let query: any = {
            WHERE: {
               GT: {
                  courses_avg: 97
               }
            },
            OPTIONS: {
                COLUMNS: [
                   "courses_dept",
                   "courses_avg"
                ],
                ORDER: "courses_avg"
            }
    };

    class QueryValidatorT implements IQueryValidator {
        public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult {
            return new QueryValidationResult(QueryValidationResultFlag.Valid, "test");
        }
    }

    let dataset: ParsedDataT[];
    let qp: QueryPerformer;
    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        let temp: ParsedDataT = new ParsedDataT();
        dataset = [temp];
        qp = new QueryPerformer(new QueryValidatorT());
    });

    it("Should properly order a dataset", async () => {
        Log.trace(query["OPTIONS"]);
        let found: any[] = await qp.performQuery(query, dataset, ["courses"]);
        for (let f of found) {
            Log.trace(f.courses_dept);
        }
        expect(found).to.deep.equal([{ courses_dept: "epse", courses_avg: 97.08 },
                                     { courses_dept: "math", courses_avg: 97.09 },
                                     { courses_dept: "epse", courses_avg: 97.19 },
                                     { courses_dept: "math", courses_avg: 97.25 },
                                     { courses_dept: "cnps", courses_avg: 97.47 },
                                     { courses_dept: "nurs", courses_avg: 98.21 },
                                     { courses_dept: "spph", courses_avg: 98.98 }]);
    });
});
