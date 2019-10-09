// import { expect } from "chai";
// import { QP2 } from "../src/services/QP2";
// import { MockSection } from "./mocks/MockSection";
// import { MockQuery } from "./mocks/MockQuery";
// import { MockQueryValidatorValid } from "./mocks/MockQueryValidatorValid";
// import { IParsedData } from "../src/data/IParsedData";
// import { ParsedCoursesData } from "../src/data/ParsedCoursesData";
// import { MockDataset } from "./mocks/MockDataset";
// import Log from "../src/Util";
// import { QueryPerformer } from "../src/services/QueryPerformer";

// describe("QueryPerformer: Leaf Filters (MComparison, SComparison)", () => {
//     const sections = MockSection.getMockSections(10);
//     const id = "test";
//     const mockQueryValidator = new MockQueryValidatorValid(id);
//     const qp = new QueryPerformer(mockQueryValidator);

//     // Give each of them an avg between 90 and 99
//     for (let i = 0; i < sections.length; ++i) {
//         sections[i].avg = 90 + i;
//     }
//     const avg95uuid = 5;
//     // Let sections [0, 1] match only * or **
//     sections[0].dept = "...";
//     sections[1].dept = "...";
//     // Let sections [2, 3] match *yy*
//     sections[2].dept = "..yy..";
//     sections[3].dept = "..yy..";
//     // Let sections [4, 5] match *yy
//     sections[4].dept = "..yy";
//     sections[5].dept = "..yy";
//     // Let sections [6, 7] match yy*
//     sections[6].dept = "yy..";
//     sections[7].dept = "yy..";
//     // Let section[8] match yy
//     sections[8].dept = "yy";
//     // let section[9] match yyy
//     sections[9].dept = "yyy";

//     const datasets: IParsedData[] = [];
//     const dataset: IParsedData = new MockDataset(id, sections);
//     datasets.push(dataset);
//     const datasetIds = [id];

//     it("GT Avg 95", async () => {
//         const query = MockQuery.GT_Avg_95(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         // The following uuids have Avg > 95:
//         // 6, 7, 8, 9
//         expect(results.length).to.equal(4);
//         for (let i = 6; i < 10; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("LT Avg 95", async () => {
//         const query = MockQuery.LT_Avg_95(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         // The following uuids have Avg < 95:
//         // [0..4]]
//         expect(results.length).to.equal(5);
//         for (let i = 0; i < 5; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("EQ Avg 95", async () => {
//         const query = MockQuery.EQ_Avg_95(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         // The following uuids have Avg < 95:
//         // 5
//         expect(results.length).to.equal(1);
//         for (let i = 5; i <= 5; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept *", async () => {
//         const query = MockQuery.IS_Dept_X(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         expect(results.length).to.equal(10);
//         for (let i = 0; i < 10; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept **", async () => {
//         const query = MockQuery.IS_Dept_XX(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         expect(results.length).to.equal(10);
//         for (let i = 0; i < 10; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept *yy*", async () => {
//         const query = MockQuery.IS_Dept_XyyX(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results: [2..9]
//         */
//         expect(results.length).to.equal(8);
//         for (let i = 2; i < 10; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept yy*", async () => {
//         const query = MockQuery.IS_Dept_yyX(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results:
//                 // Let sections [0, 1] match only * or **
//                 sections[0].dept = "...";
//                 sections[1].dept = "...";
//                 // Let sections [2, 3] match *yy*
//                 sections[2].dept = "..yy..";
//                 sections[3].dept = "..yy..";
//                 // Let sections [4, 5] match *yy
//                 sections[4].dept = "..yy";
//                 sections[5].dept = "..yy";
//                 // Let sections [6, 7] match yy*
//                 sections[6].dept = "yy..";
//                 sections[7].dept = "yy..";
//                 // Let section[8] match yy
//                 sections[8].dept = "yy";
//                 // let section[9] match yyy
//                 sections[9].dept = "yyy";

//             => 6, 7, 8, 9
//         */
//         expect(results.length).to.equal(4);
//         for (let i = 6; i < 10; ++i) {
//             if (!containsUuid(results, i, id)) {
//                 Log.trace(`Results missing uuid: ${i}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept *yy", async () => {
//         const query = MockQuery.IS_Dept_Xyy(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results:
//                 // Let sections [0, 1] match only * or **
//                 sections[0].dept = "...";
//                 sections[1].dept = "...";
//                 // Let sections [2, 3] match *yy*
//                 sections[2].dept = "..yy..";
//                 sections[3].dept = "..yy..";
//                 // Let sections [4, 5] match *yy
//                 sections[4].dept = "..yy";
//                 sections[5].dept = "..yy";
//                 // Let sections [6, 7] match yy*
//                 sections[6].dept = "yy..";
//                 sections[7].dept = "yy..";
//                 // Let section[8] match yy
//                 sections[8].dept = "yy";
//                 // let section[9] match yyy
//                 sections[9].dept = "yyy";

//             => 4, 5, 8, 9
//         */
//         expect(results.length).to.equal(4);
//         const expectedUuids = [4, 5, 8, 9];
//         for (const n of expectedUuids) {
//             if (!containsUuid(results, n, id)) {
//                 Log.trace(`Results missing uuid: ${n}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept yy", async () => {
//         const query = MockQuery.IS_Dept_yy(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results:
//                 // Let sections [0, 1] match only * or **
//                 sections[0].dept = "...";
//                 sections[1].dept = "...";
//                 // Let sections [2, 3] match *yy*
//                 sections[2].dept = "..yy..";
//                 sections[3].dept = "..yy..";
//                 // Let sections [4, 5] match *yy
//                 sections[4].dept = "..yy";
//                 sections[5].dept = "..yy";
//                 // Let sections [6, 7] match yy*
//                 sections[6].dept = "yy..";
//                 sections[7].dept = "yy..";
//                 // Let section[8] match yy
//                 sections[8].dept = "yy";
//                 // let section[9] match yyy
//                 sections[9].dept = "yyy";

//             => 8
//         */
//         expect(results.length).to.equal(1);
//         const expectedUuids = [8];
//         for (const n of expectedUuids) {
//             if (!containsUuid(results, n, id)) {
//                 Log.trace(`Results missing uuid: ${n}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept yyy", async () => {
//         const query = MockQuery.IS_Dept_yyy(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results:
//                 // Let sections [0, 1] match only * or **
//                 sections[0].dept = "...";
//                 sections[1].dept = "...";
//                 // Let sections [2, 3] match *yy*
//                 sections[2].dept = "..yy..";
//                 sections[3].dept = "..yy..";
//                 // Let sections [4, 5] match *yy
//                 sections[4].dept = "..yy";
//                 sections[5].dept = "..yy";
//                 // Let sections [6, 7] match yy*
//                 sections[6].dept = "yy..";
//                 sections[7].dept = "yy..";
//                 // Let section[8] match yy
//                 sections[8].dept = "yy";
//                 // let section[9] match yyy
//                 sections[9].dept = "yyy";

//             => 9
//         */
//         expect(results.length).to.equal(1);
//         const expectedUuids = [9];
//         for (const n of expectedUuids) {
//             if (!containsUuid(results, n, id)) {
//                 Log.trace(`Results missing uuid: ${n}`);
//                 expect.fail();
//             }
//         }
//     });

//     it("IS Dept *yyy*", async () => {
//         const query = MockQuery.IS_Dept_XyyyX(id);
//         const results: any[] = await qp.performQuery(query, datasets, datasetIds);
//         /*
//             Expected results:
//                 // Let sections [0, 1] match only * or **
//                 sections[0].dept = "...";
//                 sections[1].dept = "...";
//                 // Let sections [2, 3] match *yy*
//                 sections[2].dept = "..yy..";
//                 sections[3].dept = "..yy..";
//                 // Let sections [4, 5] match *yy
//                 sections[4].dept = "..yy";
//                 sections[5].dept = "..yy";
//                 // Let sections [6, 7] match yy*
//                 sections[6].dept = "yy..";
//                 sections[7].dept = "yy..";
//                 // Let section[8] match yy
//                 sections[8].dept = "yy";
//                 // let section[9] match yyy
//                 sections[9].dept = "yyy";

//             => 9
//         */
//         expect(results.length).to.equal(1);
//         const expectedUuids = [9];
//         for (const n of expectedUuids) {
//             if (!containsUuid(results, n, id)) {
//                 Log.trace(`Results missing uuid: ${n}`);
//                 expect.fail();
//             }
//         }
//     });
// });

// describe("QueryPerformer: LogicComparisons (AND, OR, NOT)", () => {
//     const sections = MockSection.getMockSections(10);
//     const id = "test";
//     const mockQueryValidator = new MockQueryValidatorValid(id);
//     const qp = new QueryPerformer(mockQueryValidator);

//     // Give each of them an avg between 90 and 99
//     for (let i = 0; i < sections.length; ++i) {
//         sections[i].avg = 90 + i;
//     }
//     const avg95uuid = 5;
//     // Let sections [0, 1] match only * or **
//     sections[0].dept = "...";
//     sections[1].dept = "...";
//     // Let sections [2, 3] match *yy*
//     sections[2].dept = "..yy..";
//     sections[3].dept = "..yy..";
//     // Let sections [4, 5] match *yy
//     sections[4].dept = "..yy";
//     sections[5].dept = "..yy";
//     // Let sections [6, 7] match yy*
//     sections[6].dept = "yy..";
//     sections[7].dept = "yy..";
//     // Let section[8] match yy
//     sections[8].dept = "yy";
//     // let section[9] match yyy
//     sections[9].dept = "yyy";

//     const datasets: IParsedData[] = [];
//     const dataset: IParsedData = new MockDataset(id, sections);
//     datasets.push(dataset);
//     const datasetIds = [id];

//     it ("NOT AVG GT 95", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const not: MockQuery = MockQuery.NOT(id, gtAvg95);
//         const results: any[] = await qp.performQuery(not, datasets, datasetIds);
//         /**
//          * Expected results: [0..5]
//          */
//         const expectedUuids = [0, 1, 2, 3, 4, 5];
//         expect(results).to.have.lengthOf(expectedUuids.length);
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });

//     it ("NOT DEPT IS *yy", async () => {
//         let isDeptyy: MockQuery = MockQuery.IS_Dept_Xyy(id);
//         let notisDeptyy: MockQuery = MockQuery.NOT(id, isDeptyy);
//         const results: any[] = await qp.performQuery(notisDeptyy, datasets, datasetIds);
//         let expected: number[] = [0, 1, 2, 3, 6, 7];
//         expect(results).to.have.lengthOf(expected.length);
//         if (!containsAllUuids(results, expected, id)) {
//             expect.fail();
//         }
//     });

//     it("NOT AND2 [GT Avg 95, IS Dept *]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const isDeptX: MockQuery = MockQuery.IS_Dept_X(id);
//         const and2: MockQuery = MockQuery.AND2(id, gtAvg95, isDeptX);
//         const notand2: MockQuery = MockQuery.NOT(id, and2);
//         const results: any[] = await qp.performQuery(notand2, datasets, datasetIds);
//         /**
//          * Expected results: [0..5]
//          */
//         expect(results).to.have.lengthOf(6);
//         const expectedUuids = [0, 1, 2, 3, 4, 5];
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });

//     it("AND1 [AVG GT 95]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const and1: MockQuery = MockQuery.AND1(id, gtAvg95);
//         const results: any[] = await qp.performQuery(and1, datasets, datasetIds);
//         /**
//          * Expected results: [6,7,8,9]
//          */
//         const expectedUuids = [6, 7, 8, 9];
//         expect(results).to.have.lengthOf(expectedUuids.length);
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });

//     it("AND3 [GT Avg 95, IS Dept *, LT Avg 95]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const isDeptX: MockQuery = MockQuery.IS_Dept_X(id);
//         const ltAvg95: MockQuery = MockQuery.LT_Avg_95(id);
//         const and3: MockQuery = MockQuery.AND3(id, gtAvg95, isDeptX, ltAvg95);
//         const results: any[] = await qp.performQuery(and3, datasets, datasetIds);
//         /**
//          * Expected results: []
//          */
//         expect(results).to.have.lengthOf(0);
//     });

//     it("OR3 [GT Avg 95, IS Dept *, LT Avg 95]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const isDeptX: MockQuery = MockQuery.IS_Dept_X(id);
//         const ltAvg95: MockQuery = MockQuery.LT_Avg_95(id);
//         const or3: MockQuery = MockQuery.OR3(id, gtAvg95, isDeptX, ltAvg95);
//         const results: any[] = await qp.performQuery(or3, datasets, datasetIds);
//         /**
//          * Expected results: [0..9]
//          */
//         expect(results).to.have.lengthOf(10);
//         const expectedUuids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });

//     it("OR2 [GT Avg 95, LT Avg 95]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const ltAvg95: MockQuery = MockQuery.LT_Avg_95(id);
//         const or2: MockQuery = MockQuery.OR2(id, gtAvg95, ltAvg95);
//         const results: any[] = await qp.performQuery(or2, datasets, datasetIds);
//         /**
//          * Expected results: [0..9] \ [5]
//          */
//         expect(results).to.have.lengthOf(9);
//         const expectedUuids = [0, 1, 2, 3, 4, /* No 5 */ 6, 7, 8, 9];
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });

//     it("OR1 [GT Avg 95]", async () => {
//         const gtAvg95: MockQuery = MockQuery.GT_Avg_95(id);
//         const or1: MockQuery = MockQuery.OR1(id, gtAvg95);
//         const results: any[] = await qp.performQuery(or1, datasets, datasetIds);
//         /**
//          * Expected results: [6..9]
//          */
//         expect(results).to.have.lengthOf(4);
//         const expectedUuids = [6, 7, 8, 9];
//         if (!containsAllUuids(results, expectedUuids, id)) {
//             expect.fail();
//         }
//     });
// });

// describe("QueryPerformer: Order", () => {
//     const sections = MockSection.getMockSections(10);
//     const id = "test";
//     const mockQueryValidator = new MockQueryValidatorValid(id);
//     const qp = new QueryPerformer(mockQueryValidator);
//     sections[0].avg = 1;
//     sections[1].avg = 100;
//     sections[2].avg = 10;
//     sections[3].avg = 10000;
//     sections[4].avg = 1000;
//     sections[5].avg = 1000000000;
//     sections[6].avg = 100000;
//     sections[7].avg = 10000000000;
//     sections[8].avg = 10000000;
//     sections[9].avg = 1000000;
//     const uuidsInOrder = [0, 2, 1, 4, 3, 6, 9, 8, 5, 7];

//     // Let the depts have the same order
//     sections[0].dept = "a";
//     sections[2].dept = "b";
//     sections[1].dept = "bb";
//     sections[4].dept = "c";
//     sections[3].dept = "d";
//     sections[6].dept = "e";
//     sections[9].dept = "f";
//     sections[8].dept = "g";
//     sections[5].dept = "h";
//     sections[7].dept = "i";

//     const datasets: IParsedData[] = [];
//     const dataset: IParsedData = new MockDataset(id, sections);
//     datasets.push(dataset);
//     const datasetIds = [id];

//     it ("Order by Avg", async () => {
//         const query: any = MockQuery.IS_Dept_X(id); // don't filter any
//         query.OPTIONS.ORDER = id + "_avg";
//         const results = await qp.performQuery(query, datasets, datasetIds);
//         expect(results).to.have.lengthOf(uuidsInOrder.length);
//         for (let i = 0; i < uuidsInOrder.length; ++i) {
//             expect(results[i][id + "_uuid"]).to.equal(uuidsInOrder[i].toString());
//         }
//     });

//     it ("Order by Dept", async () => {
//         const query: any = MockQuery.IS_Dept_X(id); // don't filter any
//         query.OPTIONS.ORDER = id + "_dept";
//         const results = await qp.performQuery(query, datasets, datasetIds);
//         expect(results).to.have.lengthOf(uuidsInOrder.length);
//         for (let i = 0; i < uuidsInOrder.length; ++i) {
//             expect(results[i][id + "_uuid"]).to.equal(uuidsInOrder[i].toString());
//         }
//     });
// });

// /**
//  * Returns whether the results contain one with the uuid (uuid is always requested)
//  * @param uuid NUMERIC uuid (for convenience)
//  */
// function containsUuid(results: any[], uuid: number, id: string): boolean {
//     for (const r of results) {
//         if (r[id + "_uuid"] === uuid.toString()) {
//             return true;
//         }
//     }
//     return false;
// }

// /**
//  * Returns whether the results contain all the uuids
//  * @param uuids NUMERIC uuid array (for convenience)
//  */
// function containsAllUuids(results: any[], uuids: number[], id: string): boolean {
//     for (const u of uuids) {
//         if (!containsUuid(results, u, id)) {
//             return false;
//         }
//     }
//     return true;
// }
