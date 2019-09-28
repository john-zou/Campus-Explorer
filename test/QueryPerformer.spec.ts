import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";

describe("OrderData", () => {
    // Constructing a new IParsedData to use in testing
    class IParsedDataT implements IParsedData {
        public data: [];
        public id: "test";
        public kind: InsightDatasetKind.Courses;
        public numRows: 2;
    }
    let dataset: IParsedDataT;
    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        dataset = new IParsedDataT();
    });

    it("Should properly order a dataset", async () => {
        // Note that an 'order' query will just be a string
        let order: string = "courses_avg";
        // dataset.data = [];
    });
});
