import { expect } from "chai";
import { tablesearch } from "../src/D2/data/IndexValidatorFunctions";
const Parse5 = require("parse5");
// rely on autoimport

describe("Tests on index validator functions", () => {
    let testDoc: Document;
    before(() => {
        // Generate a testing Document
        let testhtmlstring: string = "<!DOCTYPE html> \
        <html> \
                <div> \
                    <table> \
                        <thead> \
                            <tr> \
                                <th> \
                                  Title \
                                  </th> \
                            </tr> \
                        </thead> \
                        <tbody> \
                            <tr> \
                                <th> \
                                  Element \
                                  </th> \
                            </tr> \
                        </tbody> \
                    </table> \
                </div> \
        </html>";
        testDoc = Parse5.parse(testhtmlstring);
    });

    beforeEach(() => {
        // Runs before every test. Happens after "before"
    });

    it("Should find table in simple html example", async () => {
        let expected: number = 2;
        let resultDoc = tablesearch(testDoc);
        expect(testDoc.childNodes.length).to.equal(expected);
    });
});