"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IQueryValidator_1 = require("../../src/services/IQueryValidator");
class MockQueryValidatorValid {
    constructor(datasetId) {
        this.datasetId = datasetId;
    }
    validate(json, datasetIds, kind) {
        return new IQueryValidator_1.QueryValidationResult(IQueryValidator_1.QueryValidationResultFlag.Valid, this.datasetId);
    }
}
exports.MockQueryValidatorValid = MockQueryValidatorValid;
//# sourceMappingURL=MockQueryValidatorValid.js.map