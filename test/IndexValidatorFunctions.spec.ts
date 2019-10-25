import { expect } from "chai";
import { tablesearch } from "../src/D2/data/IndexValidatorFunctions";
import { findNode } from "../src/D2/data/IndexValidatorFunctions";
const Parse5 = require("parse5");
// rely on autoimport

describe("Tests on index validator functions", () => {
    let testDoc: Document;
    before(() => {
        // Generate a testing Document
        let testhtmlstring: string = "<!DOCTYPE html> \
        <html> \
                <div> \
                    <table class='views-table cols-5 table'> \
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
        let expectedLength: number = 1;
        let expectedNumChild: number = 5;
        let result: ChildNode[] = tablesearch(testDoc);
        expect(result.length).to.equal(expectedLength);
        expect(result[0].childNodes.length).to.equal(expectedNumChild);
    });

    it("Should properly find a child node", async () => {
        let tables: ChildNode[] = tablesearch(testDoc);
        let expectedChild: ChildNode = tables[0].childNodes[1];
        let result: ChildNode = findNode(tables[0].childNodes, "thead");
        expect(result).to.deep.equal(expectedChild);
    });

    it("Should not find a child node which does not exist", async () => {
        let tables: ChildNode[] = tablesearch(testDoc);
        let expectedChild: ChildNode = tables[0].childNodes[1];
        try {
            let result: ChildNode = findNode(tables[0].childNodes, "Does not exist");
            // fail
            expect(1).to.equal(0);
        } catch (error) {
            // pass
        }
    });
});
