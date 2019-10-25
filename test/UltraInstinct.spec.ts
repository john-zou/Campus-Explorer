import { expect } from "chai";
import * as fs from "fs-extra";
import { ULTRAINSTINCT } from "../src/D2/query/Ultra Instinct/UltraInstinct";
import { DiskManager } from "../src/services/DiskManager";
import InsightFacade from "../src/controller/InsightFacade";
import { InsightDatasetKind, InsightError } from "../src/controller/IInsightFacade";
import Log from "../src/Util";

describe("Rooms Zip => ActualDataset", () => {
    const insight = new InsightFacade();
    let datasets: { [id: string]: string } = {};
    let insightFacade: InsightFacade;
    const cacheDir = __dirname + "/../data";

    const datasetsToLoad: { [id: string]: string } = {
        rooms364: "./test/data/rooms/rooms364.zip",
        roomsBroken: "./test/data/rooms/roomsIndexIsNotHTML.zip",
        engl: "./test/data/engl.zip",
    };

    before(function () {
        // This section runs once and loads all datasets specified in the datasetsToLoad object
        // into the datasets object
        Log.test(`Before all`);
        for (const id of Object.keys(datasetsToLoad)) {
            datasets[id] = fs.readFileSync(datasetsToLoad[id]).toString("base64");
        }
    });

    beforeEach(function () {
        // This section resets the data directory (removing any cached data) and resets the InsightFacade instance
        // This runs before each test, which should make each test independent from the previous one
        Log.test(`BeforeTest: ${this.currentTest.title}`);
        try {
           fs.removeSync(cacheDir);
           fs.mkdirSync(cacheDir);
           insightFacade = new InsightFacade();
        } catch (err) {
           Log.error(err);
        }
    });

        // helper functions
    let expectFulfilled = (p: Promise<any>, expected: any) =>
        p.then(
            (result: any) => expect(result).to.deep.equal(expected),
            (error: any) => expect.fail(error, expected, "Should not have rejected")
        );
    let expectFulfilledVoid = (p: Promise<void>) =>
        p.then(
            () => { /* expect."pass" */ },
            (error: any) => expect.fail(error, "Should not have rejected")
        );
    let expectRejected = (p: Promise<any>, errorType: any) =>
        p.then(
            (result: any) => expect.fail(`Should have rejected with ${errorType} instead of fulfilling`),
            (error: any) => {
                expect(error).to.be.instanceof(errorType);
            }
        );

    it("rooms/index.htm exists but it's not an html", async () => {
        const id = "roomsBroken";
        await expectRejected(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms), InsightError);
    });

    it("rooms directory doesn't exist", async () => {
        const id = "engl"; // a courses dataset
        await expectRejected(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms), InsightError);
    });

});
