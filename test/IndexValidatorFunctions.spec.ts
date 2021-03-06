import { expect } from "chai";
import { tablesearch, constructBuildings } from "../src/D2/data/IndexValidatorFunctions";
import { findNode } from "../src/D2/data/IndexValidatorFunctions";
import { Building } from "../src/D2/data/Building";
import { geolocate } from "../src/D2/data/GeoResponse";
const fs = require("fs");
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

    it("Should be able to parse and extract tables objects from html", async () => {
        // Start by loading an example html
        const htmlstring = (fs.readFileSync("./test/index.htm")).toString();
        const parsedHtml = Parse5.parse(htmlstring);
        const childnodes: ChildNode[] =  tablesearch(parsedHtml);
        const rooms: Building[] = constructBuildings(childnodes);
        const newBuildings: Building[] = await geolocate(rooms);
        // This test only ensures there are no error causing failures (mostly just for debugging)
    });
});
