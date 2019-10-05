// import { expect } from "chai";
// import * as fs from "fs-extra";
// import { InsightDatasetKind, InsightDataset } from "../src/controller/IInsightFacade";
// import InsightFacade from "../src/controller/InsightFacade";
// import { InsightError, NotFoundError } from "../src/controller/IInsightFacade";
// import Log from "../src/Util";
// import TestUtil from "./TestUtil";
// import { IDataParser } from "../src/data/IDataParser";
// import { IParsedData } from "../src/data/IParsedData";
// import { DatasetManager } from "../src/services/DatasetManager";

// This should match the schema given to TestUtil.validate(..) in TestUtil.readTestQueries(..)
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    // modified to avoid writing title for every test
    query: any;  // make any to allow testing structurally invalid queries
    isQueryValid: boolean;
    result: any;
    filename: string;  // This is injected when reading the file
}

// describe("InsightFacade Add/Remove/List Dataset(s)", function () {
//     // Reference any datasets you've added to test/data here and they will
//     // automatically be loaded in the 'before' hook.
//     const coursesNumRows: number = 64612;

//     const datasetsToLoad: { [id: string]: string } = {
//         validOneBadFile: "./test/data/validOneBadFile.zip",
//         simpleGood: "./test/data/simpleGood.zip",
//         simpleGoodWithBadSections: "./test/data/simpleGoodWithBadSections.zip",
//         courses: "./test/data/courses.zip",
//         engl: "./test/data/engl.zip",
//         bad: "./test/data/bad.zip",
//         goodButHasInvalidFiles: "./test/data/goodButHasInvalidFiles.zip",
//         noCoursesFolder: "./test/data/noCoursesFolder.zip",
//         noFilesInCoursesFolder: "./test/data/noFilesInCoursesFolder.zip",
//         oneBadValidJsonFile: "./test/data/oneBadValidJsonFile.zip",
//         noSections: "./test/data/noSections.zip",
//         oneBadValidJsonFileKey: "./test/data/oneBadValidJsonFileKey.zip",
//         invalidSectionsOneValid: "./test/data/invalidSectionsOneValid.zip"
//     };
//     let datasets: { [id: string]: string } = {};
//     let insightFacade: InsightFacade;
//     const cacheDir = __dirname + "/../data";

//     before(function () {
//         // This section runs once and loads all datasets specified in the datasetsToLoad object
//         // into the datasets object
//         Log.test(`Before all`);
//         for (const id of Object.keys(datasetsToLoad)) {
//             datasets[id] = fs.readFileSync(datasetsToLoad[id]).toString("base64");
//         }
//     });

//     beforeEach(function () {
//         // This section resets the data directory (removing any cached data) and resets the InsightFacade instance
//         // This runs before each test, which should make each test independent from the previous one
//         Log.test(`BeforeTest: ${this.currentTest.title}`);
//         try {
//             fs.removeSync(cacheDir);
//             fs.mkdirSync(cacheDir);
//             insightFacade = new InsightFacade();
//         } catch (err) {
//             Log.error(err);
//         }
//     });

//     after(function () {
//         Log.test(`After: ${this.test.parent.title}`);
//     });

//     afterEach(function () {
//         Log.test(`AfterTest: ${this.currentTest.title}`);
//     });

//     // This is a unit test. You should create more like this!
//     it(`Should add the "courses" dataset`, async function () {
//         const id: string = "courses";
//         const expected: string[] = [id];
//         let result;
//         try {
//             result = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         } catch (err) {
//             throw err;
//         }
//         expect(result).to.deep.equal(expected);
//     });

//     it("Should add the simpleGood dataset", async function () {
//         const id: string = "simpleGood";
//         const expected: string[] = [id];
//         let result;
//         try {
//             result = await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         } catch (err) {
//             throw err;
//         }
//         expect(result).to.deep.equal(expected);
//     });

//     it("Should reject with InsightError on invalid id", async () => {
//         const id: string = "classes";
//         const id1: string = "_";
//         const id2: string = " ";
//         const id3: string = "aaa_";
//         const id4: string = "_aaa";
//         await expectRejected(insightFacade.addDataset(id1, datasets[id], InsightDatasetKind.Courses), InsightError);
//         await expectRejected(insightFacade.addDataset(id2, datasets[id], InsightDatasetKind.Courses), InsightError);
//         await expectRejected(insightFacade.addDataset(id3, datasets[id], InsightDatasetKind.Courses), InsightError);
//         await expectRejected(insightFacade.addDataset(id4, datasets[id], InsightDatasetKind.Courses), InsightError);
//     });

//     // helper functions
//     let expectFulfilled = (p: Promise<any>, expected: any) =>
//         p.then(
//             (result: any) => expect(result).to.deep.equal(expected),
//             (error: any) => expect.fail(error, expected, "Should not have rejected")
//         );

//     let expectFulfilledVoid = (p: Promise<void>) =>
//         p.then(
//             () => { /* expect."pass" */ },
//             (error: any) => expect.fail(error, "Should not have rejected")
//         );

//     let expectRejected = (p: Promise<any>, errorType: any) =>
//         p.then(
//             (result: any) => expect.fail(`Should have rejected with ${errorType} instead of fulfilling`),
//             (error: any) => {
//                 expect(error).to.be.instanceof(errorType);
//             }
//         );

//     it("Should add a valid dataset with non-Json file or Json but invalid file", async () => {
//         const id1: string = "goodButHasInvalidFiles";
//         const id2: string = "oneBadValidJsonFile";
//         const id3: string = "oneBadValidJsonFileKey";
//         const expected1: string[] = [id1];
//         const expected2: string[] = [id1, id2];
//         const expected3: string[] = [id1, id2, id3];
//         await expectFulfilled(insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses), expected1);
//         await expectFulfilled(insightFacade.addDataset(id2, datasets[id2], InsightDatasetKind.Courses), expected2);
//         await expectFulfilled(insightFacade.addDataset(id3, datasets[id3], InsightDatasetKind.Courses), expected3);
//     });

//     it("Should add a valid dataset with 1 valid section inside a file with invalid sections", async () => {
//         const id: string = "simpleGoodWithBadSections";
//         const expected: string[] = [id];
//         await expectFulfilled(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), expected);
//     });

//     it("Should add a valid dataset with 1 valid section inside a file with invalid sections, and one bad file",
//     async () => {
//         const id: string = "validOneBadFile";
//         const expected: string[] = [id];
//         await expectFulfilled(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), expected);
//     });

//     it("Should add a valid dataset despite all flavors of invalid sections because some are valid", async () => {
//         const id: string = "invalidSectionsOneValid";
//         const expected: string[] = [id];
//         await expectFulfilled(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), expected);
//     });

//     class MockParsedData implements IParsedData {
//         public data: any[] = [{data: "value"}];
//         public id: string = "mock";
//         public kind: InsightDatasetKind = InsightDatasetKind.Courses;
//         public numRows: 1;
//     }

//     class MockDataParser implements IDataParser {
//         public parseDatasetZip(id: string, content: string, kind: InsightDatasetKind):
//             Promise<import ("../src/data/IParsedData").IParsedData> {
//             return Promise.resolve(new MockParsedData());
//         }
//     }

//     it("The dataset manager should not add dataset if id is null", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectRejected(dm.addDataset(null, "blablabla", InsightDatasetKind.Courses), InsightError);
//     });

//     it("The dataset manager should not add dataset if content is null", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectRejected(dm.addDataset("blabla", null, InsightDatasetKind.Courses), InsightError);
//     });

//     it("The dataset manager should not add dataset if dataset with id is already added", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectFulfilledVoid(dm.addDataset("mock", "blablabla", InsightDatasetKind.Courses));
//         await expectRejected(dm.addDataset("mock", "blablabla", InsightDatasetKind.Courses), InsightError);
//     });

//     it("The dataset manager should remove dataset", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectFulfilledVoid(dm.addDataset("mock", "blablabla", InsightDatasetKind.Courses));
//         await expectFulfilled(dm.removeDataset("mock"), "mock");
//     });

//     it("The dataset manager should not remove dataset that has not been added", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectRejected(dm.removeDataset("mock"), NotFoundError);
//     });

//     it("The dataset manager should not remove dataset if id is null", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectRejected(dm.removeDataset(null), InsightError);
//     });

//     it("The dataset manager should not remove dataset if id is undefined", async () => {
//         let dm = new DatasetManager(new MockDataParser());
//         await expectRejected(dm.removeDataset(undefined), InsightError);
//     });

//     it("Should not add invalid dataset (obvious invalidities)", async () => {
//         const id1: string = "noCoursesFolder";
//         const id2: string = "noFilesInCoursesFolder";
//         await expectRejected(insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses), InsightError);
//         await expectRejected(insightFacade.addDataset(id2, datasets[id2], InsightDatasetKind.Courses), InsightError);
//     });

//     it("Should not add invalid dataset (no sections)", async () => {
//         const id: string = "noSections";
//         await expectRejected(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), InsightError);
//     });

//     it("Should add two datasets successfully", async () => {
//         const id1: string = "courses";
//         const id2: string = "engl";
//         const expected1: string[] = [id1];
//         const expected2: string[] = [id1, id2];
//         await expectFulfilled(insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses), expected1);
//         await expectFulfilled(insightFacade.addDataset(id2, datasets[id2], InsightDatasetKind.Courses), expected2);
//     });

//     it("Should list the dataset after adding", async () => {
//         const id: string = "courses";
//         await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         const ds: InsightDataset[] = await insightFacade.listDatasets();
//         expect(ds.length).to.equal(1);
//         expect(ds[0].kind).to.equal(InsightDatasetKind.Courses);
//         expect(ds[0].id).to.equal(id);
//     });

//     it("Should list nothing before adding and after adding then removing", async () => {
//         const id: string = "courses";
//         let ds: InsightDataset[] = await insightFacade.listDatasets();
//         expect(ds.length).to.equal(0);
//         await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         await insightFacade.removeDataset(id);
//         ds = await insightFacade.listDatasets();
//         expect(ds.length).to.equal(0);
//     });

//     it("Should reject with InsightError on null id",
//         async () => {
//             await
//                 expectRejected(
//                     insightFacade.addDataset(null, datasets["courses"], InsightDatasetKind.Courses), InsightError);
//         }
//     );

//     it("Should reject with InsightError on valid id but null dataset",
//         async () => {
//             const id: string = "courses";
//             await expectRejected(insightFacade.addDataset(id, null, InsightDatasetKind.Courses), InsightError);
//         }
//     );

//     it("Should reject with InsightError on valid id but bad dataset zip file",
//         async () => {
//             const id: string = "courses";
//             const badDatasetId: string = "bad";
//             await expectRejected(
//                 insightFacade.addDataset(id, datasets[badDatasetId], InsightDatasetKind.Courses), InsightError);
//         }
//     );

//     it(`The courses dataset, after added and listed, should have ${coursesNumRows} rows`,
//         async () => {
//             const id: string = "courses";
//             await expectFulfilled(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), [id]);
//             const dataSets = await insightFacade.listDatasets();
//             expect(dataSets[0].numRows).to.equal(coursesNumRows);
//         }
//     );

//     // Not applicable for d1:
//     // it("Should reject with InsightError on valid id and dataset, but mismatched InsightDatasetKind",
//     //     async () => {
//     //         const id: string = "courses";
//     //         await expectRejected(
    // insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Rooms), InsightError);
//     //     }
//     // );

//     it("Should reject with InsightError on valid dataset added twice",
//         async () => {
//             const id: string = "courses";
//             await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//             await expectRejected(insightFacade.addDataset
// (id, datasets[id], InsightDatasetKind.Courses), InsightError);
//         }
//     );

//     it("Should remove a dataset after adding it", async () => {
//         const id: string = "courses";
//         await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         await expectFulfilled(insightFacade.removeDataset(id), id);
//     });

//     it("Should reject with InsightError on removal of invalid id name after adding a dataset", async () => {
//         const id: string = "courses";
//         await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//         const id1: string = "_";
//         const id2: string = " ";
//         const id3: string = "courses_";
//         const id4: string = "_courses";
//         await expectRejected(insightFacade.removeDataset(id1), InsightError);
//         await expectRejected(insightFacade.removeDataset(id2), InsightError);
//         await expectRejected(insightFacade.removeDataset(id3), InsightError);
//         await expectRejected(insightFacade.removeDataset(id4), InsightError);

//     });

//     it("Should remove the exact requested dataset after adding two datasets", async () => {
//         const id1: string = "courses";
//         const id2: string = "engl";
//         await insightFacade.addDataset(id1, datasets[id1], InsightDatasetKind.Courses);
//         await insightFacade.addDataset(id2, datasets[id2], InsightDatasetKind.Courses);
//         await expectFulfilled(insightFacade.removeDataset(id1), id1);
//         const ds: InsightDataset[] = await insightFacade.listDatasets();
//         expect(ds.length).to.equal(1);
//         expect(ds[0].id).to.equal(id2);
//     });

//     it("Should reject with NotFoundError on valid but nonexistent id both before and after adding a valid dataset",
//         async () => {
//             const validNonexistentId: string = "valid";
//             const existentId: string = "courses";
//             await expectRejected(insightFacade.removeDataset(validNonexistentId), NotFoundError);
//             await insightFacade.addDataset(existentId, datasets[existentId], InsightDatasetKind.Courses);
//             await expectRejected(insightFacade.removeDataset(validNonexistentId), NotFoundError);
//         });

//     it("Should allow dataset to be added again after removing it",
//         async () => {
//             const id: string = "courses";
//             const expected: string[] = [id];
//             await insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses);
//             await insightFacade.removeDataset(id);
//             await expectFulfilled(insightFacade.addDataset(id, datasets[id], InsightDatasetKind.Courses), expected);
//         });

//     it("This is just to clear the cache",
//         async () => {
//             return;
//         });
// });

// /*
//  * This test suite dynamically generates tests from the JSON files in test/queries.
//  * You should not need to modify it; instead, add additional files to the queries directory.
//  * You can still make tests the normal way, this is just a convenient tool for a majority of queries.
//  */
// describe("InsightFacade PerformQuery", () => {
//     const datasetsToQuery: { [id: string]: any } = {
//         courses: { id: "courses", path: "./test/data/courses.zip", kind: InsightDatasetKind.Courses },
//         engl: { id: "engl", path: "./test/data/engl.zip", kind: InsightDatasetKind.Courses },
//     };
//     let insightFacade: InsightFacade = new InsightFacade();
//     let testQueries: ITestQuery[] = [];

//     // Load all the test queries, and call addDataset on the insightFacade instance for all the datasets
//     before(function () {
//         Log.test(`Before: ${this.test.parent.title}`);

//         // Load the query JSON files under test/queries.
//         // Fail if there is a problem reading ANY query.
//         try {
//             testQueries = TestUtil.readTestQueries();
//         } catch (err) {
//             expect.fail("", "", `Failed to read one or more test queries. ${err}`);
//         }

//         // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
//         // Will fail* if there is a problem reading ANY dataset.
//         const loadDatasetPromises: Array<Promise<string[]>> = [];
//         for (const key of Object.keys(datasetsToQuery)) {
//             const ds = datasetsToQuery[key];
//             const data = fs.readFileSync(ds.path).toString("base64");
//             loadDatasetPromises.push(insightFacade.addDataset(ds.id, data, ds.kind));
//         }
//         return Promise.all(loadDatasetPromises).catch((err) => {
//             /* *IMPORTANT NOTE: This catch is to let this run even without the implemented addDataset,
//              * for the purposes of seeing all your tests run.
//              * For D1, remove this catch block (but keep the Promise.all)
//              */
//             return Promise.resolve("HACK TO LET QUERIES RUN");
//         });
//     });

//     beforeEach(function () {
//         Log.test(`BeforeTest: ${this.currentTest.title}`);
//     });

//     after(function () {
//         Log.test(`After: ${this.test.parent.title}`);
//     });

//     afterEach(function () {
//         Log.test(`AfterTest: ${this.currentTest.title}`);
//     });

//     // Dynamically create and run a test for each query in testQueries
//     // Creates an extra "test" called "Should run test queries" as a byproduct. Don't worry about it
//     it("Should run test queries", function () {
//         describe("Dynamic InsightFacade PerformQuery tests", function () {
//             for (const test of testQueries) {
//                 // Modified to make the json files easier
//                 it(test.filename, function (done) {
//                     insightFacade.performQuery(test.query).then((result) => {
//                         TestUtil.checkQueryResult(test, result, done);
//                     }).catch((err) => {
//                         TestUtil.checkQueryResult(test, err, done);
//                     });
//                 });
//             }
//         });
//     });
// });
