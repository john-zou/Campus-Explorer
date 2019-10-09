// import { expect } from "chai";
// import { SmartQuery } from "../src/query_schema/SmartQuery";
// import { ISmartQuery, FilterType, INegation, IMComparison,
//     MComparator, MField, ColumnType } from "../src/query_schema/ISmartQuery";

// // rely on autoimport

// describe("SmartQueryBuilder: NOT", () => {
//     // Declare common objects as local variables
//     before(() => {
//         // Runs once, before any "beforeEach"

//     });

//     beforeEach(() => {
//         // Runs before every test. Happens after "before"
//     });

//     it("Parsing of NOT GT Avg 95", async () => {
//         const query: any = {
//             WHERE: {
//                 NOT: {
//                     GT: {
//                         courses_avg: 95
//                     }
//                 }
//             },
//             OPTIONS: {
//                 COLUMNS: [ "courses_avg" ]
//             }
//         };
//         const smartQuery: ISmartQuery = SmartQuery.fromValidQueryJson("courses", query);
//         expect(smartQuery.HasFilter).to.equal(true);
//         expect(smartQuery.HasOrder).to.equal(false);
//         const smartFilter = smartQuery.Filter;
//         expect(smartFilter.Type).to.equal(FilterType.Negation);
//         const innerFilter = smartFilter.Filter as INegation;
//         const gtAvg95SmF = innerFilter.Filter;
//         expect(gtAvg95SmF.Type).to.equal(FilterType.MComparison);
//         const gtAvg95filter = gtAvg95SmF.Filter as IMComparison;
//         expect (gtAvg95filter.MComparator).to.equal(MComparator.GT);
//         expect (gtAvg95filter.MField).to.equal(MField.Avg);
//         expect (gtAvg95filter.Value).to.equal(95);
//         expect(smartQuery.Columns).to.have.length(1);
//         expect(smartQuery.Columns[0].Type).to.equal(ColumnType.MField);
//         expect(smartQuery.Columns[0].Field).to.equal(MField.Avg);
//     });
// });
