import { expect } from "chai";
import { IDataParser } from "../src/data/IDataParser";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { IParsedData } from "../src/data/IParsedData";
import { DatasetManager } from "../src/services/DatasetManager";

// rely on autoimport

describe("DatasetManager Tests", () => {
    // Declare common objects as local variables
    class MockParsedData implements IParsedData {
        public data: any[];
        public id: string = "mock";
        public kind: InsightDatasetKind;
        public numRows: number = 1;
    }

    class MockParser implements IDataParser {
        public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
            return new MockParsedData();
        }

    }

    const dm: DatasetManager = new DatasetManager(new MockParser());

    before(() => {
        // Runs once, before any "beforeEach"

    });

    beforeEach(() => {
        // Runs before every test. Happens after "before"
    });

    it("Should add a valid dataset", async () => {
        await dm.addDataset("mock", "str", InsightDatasetKind.Courses);
        expect(dm.datasetIds).to.deep.equal(["mock"]);
    });
});
