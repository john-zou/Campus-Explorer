import { expect } from "chai";
import { IParsedData } from "../src/data/IParsedData";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { DatasetManager } from "../src/services/DatasetManager";
import { QueryPerformer } from "../src/services/QueryPerformer";
import TestUtil from "./TestUtil";
import Log from "../src/Util";
import { IQueryValidator, QueryValidationResultFlag, QueryValidationResult } from "../src/services/IQueryValidator";
import { IQuery, IGt, IFilter, IOptions } from "../src/query_schema/IQuery";
import { orderData, whereFilter, removeColumns } from "../src/services/QueryPerformerFunctions";
import { ColumnType, MField, SField, ISmartColumn } from "../src/query_schema/ISmartQuery";
import { ISection } from "../src/data/ISection";
import { Section } from "../src/data/Section";

describe("QueryPerformerFunctions : orderData", () => {
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
        let temp: ParsedDataT = new ParsedDataT([{ dept: "epse", avg: 97.19 },
                                                 { dept: "math", avg: 97.09 },
                                                 { dept: "nurs", avg: 98.21 },
                                                 { dept: "epse", avg: 97.08 },
                                                 { dept: "cnps", avg: 97.47 },
                                                 { dept: "math", avg: 97.25 },
                                                 { dept: "spph", avg: 98.98 }],
                                                 "test", 2);
        dataset = [temp];
        qp = new QueryPerformer(new QueryValidatorT());
    });

    it("Should order data correctly, numbers", async () => {
        let result: ISection[] = orderData({Type: ColumnType.MField, Field: MField.Avg}, dataset[0].data);
        expect(result.length).equals(7);
        expect(result).deep.equals([{ dept: "epse", avg: 97.08 },
                                    { dept: "math", avg: 97.09 },
                                    { dept: "epse", avg: 97.19 },
                                    { dept: "math", avg: 97.25 },
                                    { dept: "cnps", avg: 97.47 },
                                    { dept: "nurs", avg: 98.21 },
                                    { dept: "spph", avg: 98.98 }]);
    });

    it("Should order data correctly, strings", async () => {
        let result: ISection[] = orderData({Type: ColumnType.SField, Field: SField.Dept}, dataset[0].data);
        expect(result.length).equals(7);
        expect(result).deep.equals([{ dept: "cnps", avg: 97.47 },
                                    { dept: "epse", avg: 97.19 },
                                    { dept: "epse", avg: 97.08 },
                                    { dept: "math", avg: 97.09 },
                                    { dept: "math", avg: 97.25 },
                                    { dept: "nurs", avg: 98.21 },
                                    { dept: "spph", avg: 98.98 }]);
    });
});

describe("QueryPerformerFunctions : filterWhere", () => {
    let testSection: ISection;
    before(() => {
        // Runs once, before any "beforeEach"
    });

    beforeEach(() => {
        testSection = {
            // setUuid(uuid: string): void { /*none*/},
            dept: "math",
            id: "201",
            avg: 97,
            instructor: "Folk",
            title: "Quantum",
            pass: 53,
            fail: 50,
            audit: 3,
            year: 2018,
            uuid: "234"
        };
    });

    // it("Should properly filter using whereFilter for number type, GT", async () => {
    //     // Case 1, accept
    //     let result: boolean = whereFilter(testSection, {GT: {courses_avg: 97}});
    //     expect(result).to.equal(true);
    //     // Case 2, reject
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 93 }, {GT: {courses_avg: 97}});
    //     expect(result).to.equal(false);
    // });

    // it("Should properly filter string type, GT", async () => {
    //     // Case 1, accept
    //     let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 97.08 },
    //         {GT: {courses_dept: "math"}});
    //     expect(result).to.equal(true);
    //     // Case 2, reject
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 93 }, {GT: {courses_dept: "cpsc"}});
    //     expect(result).to.equal(false);
    // });

    // it("Should properly filter, LT", async () => {
    //     // Case 1, accept
    //     let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 97.08 }, {LT: {courses_avg: 99}});
    //     expect(result).to.equal(true);
    //     // Case 2, reject
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 98 }, {LT: {courses_avg: 97}});
    //     expect(result).to.equal(false);
    // });

    // it("Should properly filter, EQ", async () => {
    //     // Case 1, accept
    //     let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 99 }, {EQ: {courses_avg: 99}});
    //     expect(result).to.equal(true);
    //     // Case 2, reject
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 97 }, {EQ: {courses_avg: 98}});
    //     expect(result).to.equal(false);
    // });

    // it("Should correctly apply AND", async () => {
    //     let where: any = {AND: [{GT: { courses_avg: 96}},
    //                            {IS: { courses_dept: "epse"}}]};
    //     // Case 1, accept
    //     let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 99 }, {EQ: {courses_avg: 99}});
    //     expect(result).to.equal(true);
    //     // Case 2, reject
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 90 }, where);
    //     expect(result).to.equal(false);
    //     // Case 3, reject
    //     result = whereFilter({ courses_dept: "cpsc", courses_avg: 99 }, where);
    //     expect(result).to.equal(false);
    // });

    // it("Should correctly apply OR", async () => {
    //     let where: any = {OR: [{GT: { courses_avg: 96}},
    //         {IS: { courses_dept: "epse"}}]};
    //     // Case 1, accept
    //     let result: boolean = whereFilter({ courses_dept: "epse", courses_avg: 99 }, {EQ: {courses_avg: 99}});
    //     expect(result).to.equal(true);
    //     // Case 2, accept
    //     result = whereFilter({ courses_dept: "epse", courses_avg: 90 }, where);
    //     expect(result).to.equal(true);
    //     // Case 3, accept
    //     result = whereFilter({ courses_dept: "cpsc", courses_avg: 99 }, where);
    //     expect(result).to.equal(true);
    //     // Case 4, reject
    //     result = whereFilter({ courses_dept: "cpsc", courses_avg: 90 }, where);
    //     expect(result).to.equal(false);
    // });
});

describe("QueryPerformerFunctions : removeColumns", () => {
    let testSections: ISection[];

    before(() => {
        testSections = [{
            // setUuid(uuid: string): void { /*none*/},
            dept: "math",
            id: "201",
            avg: 97,
            instructor: "Folk",
            title: "Quantum",
            pass: 53,
            fail: 50,
            audit: 3,
            year: 2018,
            uuid: "234"
        }];
    });

    beforeEach(() => {
        // Nothing
    });

    it("Should be able to remove columns", async () => {
        let columns: ISmartColumn[];
        columns = [{Type: ColumnType.MField, Field: MField.Avg}, {Type: ColumnType.SField, Field: SField.Dept}];
        let result: any[] = removeColumns(columns, testSections, "courses");
        expect(result).to.deep.equal([{courses_dept: "math", courses_avg: 97}]);
    });
});
