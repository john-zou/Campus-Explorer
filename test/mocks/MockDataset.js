"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("../../src/controller/IInsightFacade");
class MockDataset {
    constructor(id, data) {
        this.kind = IInsightFacade_1.InsightDatasetKind.Courses;
        this.data = data;
        this.id = id;
    }
    get numRows() {
        return DataCue.length;
    }
}
exports.MockDataset = MockDataset;
//# sourceMappingURL=MockDataset.js.map