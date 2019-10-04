import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";
import { QueryPerformer } from "../src/services/QueryPerformer";
import TestUtil from "./TestUtil";
import Log from "../src/Util";
import { IQueryValidator, QueryValidationResultFlag, QueryValidationResult } from "../src/services/IQueryValidator";
import { IQuery, IGt, IFilter, IOptions } from "../src/query_schema/IQuery";
import { orderData, whereFilter } from "../src/services/QueryPerformerFunctions";

// describe("Perform Query Tests", () => {
//     // ONLY tests valid queries
//     // Constructing a new IParsedData to use in testing
//     class ParsedDataT implements IParsedData {
//         public data: any[];
//         public id: string;
//         public kind: InsightDatasetKind.Courses;
//         public numRows: number;

//         public constructor(data: any[], id: string, numRows: number) {
//             this.data = data;
//             this.id = id;
//             this.kind = InsightDatasetKind.Courses;
//             this.numRows = numRows;
//         }
//     }

//     class QueryT implements IQuery {
//         public WHERE: IFilter;
//         public OPTIONS: IOptions;

//         public constructor(where: IFilter, options: IOptions) {
//             this.WHERE = where;
//             this.OPTIONS = options;
//         }
//     }

//     class QueryValidatorT implements IQueryValidator {
//         public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult {
//             return new QueryValidationResult(QueryValidationResultFlag.Valid, "test");
//         }
//     }

//     let dataset: ParsedDataT[];
//     let qp: QueryPerformer;
//     before(() => {
//         // Runs once, before any "beforeEach"
//     });

//     beforeEach(() => {
//         let temp: ParsedDataT = new ParsedDataT([{ courses_dept: "epse", courses_avg: 97.19 },
//                                                  { courses_dept: "math", courses_avg: 97.09 },
//                                                  { courses_dept: "nurs", courses_avg: 98.21 },
//                                                  { courses_dept: "epse", courses_avg: 97.08 },
//                                                  { courses_dept: "cnps", courses_avg: 97.47 },
//                                                  { courses_dept: "math", courses_avg: 97.25 },
//                                                  { courses_dept: "spph", courses_avg: 98.98 }],
//                                                  "test", 2);
//         dataset = [temp];
//         qp = new QueryPerformer(new QueryValidatorT());
//     });

//     it("Should query a dataset with no order", async () => {
//         let query: IQuery = new QueryT({GT: {courses_avg: 97}},
//             {COLUMNS : ["courses_dept", "courses_avg"]});
//         let found: any[] = await qp.performQuery(query, dataset, ["courses"]);
//         expect(found).to.deep.equal([{ courses_dept: "epse", courses_avg: 97.19 },
//                                      { courses_dept: "math", courses_avg: 97.09 },
//                                      { courses_dept: "nurs", courses_avg: 98.21 },
//                                      { courses_dept: "epse", courses_avg: 97.08 },
//                                      { courses_dept: "cnps", courses_avg: 97.47 },
//                                      { courses_dept: "math", courses_avg: 97.25 },
//                                      { courses_dept: "spph", courses_avg: 98.98 }]);
//     });

//     it("Should properly order a dataset", async () => {
//         let query: IQuery = new QueryT({GT: {courses_avg: 97}},
//             {COLUMNS : ["courses_dept", "courses_avg"], ORDER: "courses_avg"});
//         let found: any[] = await qp.performQuery(query, dataset, ["courses"]);
//         expect(found).to.deep.equal([{ courses_dept: "epse", courses_avg: 97.08 },
//                                      { courses_dept: "math", courses_avg: 97.09 },
//                                      { courses_dept: "epse", courses_avg: 97.19 },
//                                      { courses_dept: "math", courses_avg: 97.25 },
//                                      { courses_dept: "cnps", courses_avg: 97.47 },
//                                      { courses_dept: "nurs", courses_avg: 98.21 },
//                                      { courses_dept: "spph", courses_avg: 98.98 }]);
//     });
// });

describe("OrderData testing", () => {
    class QueryT implements IQuery {
        public WHERE: IFilter;
        public OPTIONS: IOptions;

        public constructor(where: IFilter, options: IOptions) {
            this.WHERE = where;
            this.OPTIONS = options;
        }
    }
    class ParsedDataT implements IParsedData {
        public data: any[];
        public id: string;
        public kind: InsightDatasetKind.Courses;
        public numRows: number;

        public constructor(data: any[], id: string, numRows: number) {
            this.data = data;
            this.id = id;
            this.kind = InsightDatasetKind.Courses;
            this.numRows = numRows;
        }
    }

    class QueryValidatorT implements IQueryValidator {
        public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult {
            return new QueryValidationResult(QueryValidationResultFlag.Valid, "test");
        }
    }
    let dataset: ParsedDataT[];
    let qp: QueryPerformer;

    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        let temp: ParsedDataT = new ParsedDataT([{ courses_dept: "epse", courses_avg: 97.19 },
                                                 { courses_dept: "math", courses_avg: 97.09 },
                                                 { courses_dept: "nurs", courses_avg: 98.21 },
                                                 { courses_dept: "epse", courses_avg: 97.08 },
                                                 { courses_dept: "cnps", courses_avg: 97.47 },
                                                 { courses_dept: "math", courses_avg: 97.25 },
                                                 { courses_dept: "spph", courses_avg: 98.98 }],
                                                 "test", 2);
        dataset = [temp];
        qp = new QueryPerformer(new QueryValidatorT());
    });

    it("Should order data correctly", async () => {
        let result: IParsedData = await orderData("courses_avg", dataset[0]);
        expect(result.data.length).equals(7);
        expect(result.data).deep.equals([{ courses_dept: "epse", courses_avg: 97.08 },
                                         { courses_dept: "math", courses_avg: 97.09 },
                                         { courses_dept: "epse", courses_avg: 97.19 },
                                         { courses_dept: "math", courses_avg: 97.25 },
                                         { courses_dept: "cnps", courses_avg: 97.47 },
                                         { courses_dept: "nurs", courses_avg: 98.21 },
                                         { courses_dept: "spph", courses_avg: 98.98 }]);
    });
});

describe("filterWhere testing", () => {

    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        // Nothing
    });

    it("Should properly filter using whereFilter for number type, GT", async () => {
        // Case 1, accept
        let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 97.08 }, {GT: {courses_avg: 97}});
        expect(result).to.equal(true);
        // Case 2, reject
        result = whereFilter({ courses_dept: "epse", courses_avg: 93 }, {GT: {courses_avg: 97}});
        expect(result).to.equal(false);
    });

    it("Should properly filter string type, GT", async () => {
        // Case 1, accept
        let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 97.08 },
            {GT: {courses_dept: "math"}});
        expect(result).to.equal(true);
        // Case 2, reject
        result = whereFilter({ courses_dept: "epse", courses_avg: 93 }, {GT: {courses_dept: "cpsc"}});
        expect(result).to.equal(false);
    });

    it("Should properly filter, LT", async () => {
        // Case 1, accept
        let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 97.08 }, {LT: {courses_avg: 99}});
        expect(result).to.equal(true);
        // Case 2, reject
        result = whereFilter({ courses_dept: "epse", courses_avg: 98 }, {LT: {courses_avg: 97}});
        expect(result).to.equal(false);
    });

    it("Should properly filter, EQ", async () => {
        // Case 1, accept
        let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 99 }, {EQ: {courses_avg: 99}});
        expect(result).to.equal(true);
        // Case 2, reject
        result = whereFilter({ courses_dept: "epse", courses_avg: 97 }, {EQ: {courses_avg: 98}});
        expect(result).to.equal(false);
    });

    it("Should correctly apply AND", async () => {
        let where: any = {AND: [{GT: { courses_avg: 96}},
                               {IS: { courses_dept: "epse"}}]};
        // Case 1, accept
        let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 99 }, {EQ: {courses_avg: 99}});
        expect(result).to.equal(true);
        // Case 2, reject
        result = whereFilter({ courses_dept: "epse", courses_avg: 90 }, where);
        expect(result).to.equal(false);
        // Case 3, reject
        result = whereFilter({ courses_dept: "cpsc", courses_avg: 96 }, where);
        expect(result).to.equal(false);
    });

    it("Should correctly apply OR", async () => {
        // TODO
    });
});
