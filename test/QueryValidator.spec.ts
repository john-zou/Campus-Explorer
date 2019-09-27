import { QueryValidator } from "../src/services/QueryValidator";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { expect } from "chai";

// Module Test Skeleton

// Import Statements

describe("QueryValidator Tests: Invalid Query", () => {
    // Declare common objects as local variables
    // Initialize a QueryValidator. It's stateless so we can just test using this one
    const v: QueryValidator = new QueryValidator();

    it("Not JSON format", async () => {
        const q: string = "not a json object";
        expect(v.validate(q, InsightDatasetKind.Courses)).to.be.false;
    });
});
