// import { QueryValidator } from "../src/services/QueryValidator";
// import { InsightDatasetKind } from "../src/controller/IInsightFacade";
// import { expect } from "chai";
// import { QueryValidationResultFlag as F } from "../src/services/IQueryValidator";
// import { validateSValue } from "../src/services/QueryValidationFunctions_Body";
// // Module Test Skeleton

// describe("QueryValidationFunctions_Body Tests: validateSValue", () => {
//     it("Valid: No Asterisks", async () => {
//         expect(validateSValue("hi hi hi hi hi")).to.equal(F.Valid);
//     });

//     it("Invalid: Asterisk not on edges", async () => {
//         expect(validateSValue(" * ")).to.equal(F.SValueContainsInternalAsterisk);
//     });

//     it("Invalid: Three asterisks", async () => {
//         expect(validateSValue("***")).to.equal(F.SValueContainsInternalAsterisk);
//     });

//     it("Valid: External asterisks", async () => {
//         expect(validateSValue("*abjabjabjabjaj*")).to.equal(F.Valid);
//     });
// });

// describe("QueryValidationFunctions_Body Tests: validateFilter", () => {
//     // Todo (low priority)
// });

// describe("QueryValidationFunctions_Body Tests: validateFilterArray", () => {
//     // Todo (low priority)
// });

// describe("QueryValidationFunctions_Body Tests: validateMComparison", () => {
//     // Todo (low priority)
// });

// describe("QueryValidationFunctions_Body Tests: validateSComparison", () => {
//     // Todo (low priority)
// });

// describe("QueryValidationFunctions_Body Tests: parseKeystring", () => {
//     // Todo (low priority)
// });
