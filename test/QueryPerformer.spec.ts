import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";
import { QueryPerformer } from "../src/services/QueryPerformer";

describe("OrderData", () => {
    // Constructing a new IParsedData to use in testing
    class IParsedDataT implements IParsedData {
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
    let dataset: IParsedDataT;
    let qp: QueryPerformer;
    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        dataset = new IParsedDataT();
        qp = new QueryPerformer();
    });

    it("Should properly order a dataset", async () => {
        // Note that an 'order' query will just be a string
        let order: string = "courses_avg";
    });
});
