import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";
import { QueryPerformer } from "../src/services/QueryPerformer";

describe("Performs Queries", () => {
    // ONLY tests valid queries
    // Constructing a new IParsedData to use in testing
    class ParsedDataT implements IParsedData {
        public data: [{ courses_dept: "epse", courses_avg: 97.09 },
                      { courses_dept: "math", courses_avg: 97.09 },
                      { courses_dept: "nurs", courses_avg: 98.21 },
                      { courses_dept: "epse", courses_avg: 97.09 },
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

    let dataset: ParsedDataT;
    let qp: QueryPerformer;
    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        dataset = new ParsedDataT();
        qp = new QueryPerformer();
    });

    it("Should properly order a dataset", async () => {
        // qp.performQuery
    });
});
