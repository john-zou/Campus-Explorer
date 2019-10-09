import { expect } from "chai";

describe("[TEST CATEGORY NAME]", () => {
    // Declare common objects as local variables
    before(() => {
        // Runs once, before any "beforeEach"

    });

    beforeEach(() => {
        // Runs before every test. Happens after "before"
    });

    it("[TEST DESCRIPTION", async () => {
        expect(1).to.equal(2);
    });
});
