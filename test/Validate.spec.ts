import { InsightDatasetKind as IDK, InsightError } from "../src/controller/IInsightFacade";
import { expect } from "chai";
import { QueryValidationResult as Res, QueryValidationResultFlag as R } from "../src/services/IQueryValidator";
import { AllData } from "../src/data/AllData";
import { Dataset } from "../src/data/Dataset";
import Insight from "../src/util/Insight";
import { getIdIfValid } from "../src/D2/query/Validate";
import { Query } from "./D2/QueryBuilder";
import Log from "../src/Util";
import { queryPipeline } from "../src/query pipeline/QueryPipeline";

const shouldRun: boolean = true;

if (shouldRun) {
    describe("queryPipeline: Bad Structure => Invalid Query", () => {
        const coursesDb = new Dataset("cc", IDK.Courses);
        const roomsDb = new Dataset("rr", IDK.Rooms);
        const owen = AllData.fromDatasetArray([coursesDb, roomsDb]);

        /**
         * Expects the query to be recognized as malformed
         * @param q some malformed query
         */
        const e = (q: any) => {
            t(q).then(
                (result: any) => expect.fail(`Should have rejected with ${InsightError} instead of fulfilling`),
                (error: any) => {
                    expect(error).to.be.instanceof(InsightError);
                }
            );
        };

        const t = async (q: any): Promise<void> => {
            try {
                queryPipeline(q, owen);
            } catch (error) {
                Log.trace(error);
                throw error;
            }
        };

        it("Missing body", async () => {
            const q = {
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("Missing options", async () => {
            const q = {
                WHERE: {}
            };
            e(q);
        });

        it("Has too many keys", async () => {
            const q = {
                WHERE: {}, OPTIONS: { COLUMNS: "test_avg" }, extraneous_key: "value"
            };
            e(q);
        });

        it("Body is wrong type", async () => {
            const q = {
                WHERE: "wrong type", OPTIONS: { COLUMNS: ["test_avg"] }
            };
            e(q);
        });

        it("Options is wrong type", async () => {
            const q = {
                WHERE: {}, OPTIONS: "wrong type"
            };
            e(q);
        });

        it("Options is missing columns", async () => {
            const q = {
                WHERE: {},
                OPTIONS: {

                }
            };
            e(q);
        });

        it("Options has invalid key", async () => {
            const q = {
                WHERE: {},
                OPTIONS: {
                    COLUMNS: ["test_avg"],
                    invalid_key: "value"
                }
            };
            e(q);
        });

        it("Filter has wrong key", async () => {
            const q = {
                WHERE: { wrong_key: "lol" },
                OPTIONS: { COLUMN: ["test_avg"] }
            };
            e(q);
        });

        it("Columns is not array", async () => {
            const q = {
                WHERE: {},
                OPTIONS: {
                    COLUMNS: 123,
                }
            };
            e(q);
        });

        it("Order is wrong type", async () => {
            const q = {
                WHERE: {},
                OPTIONS: {
                    COLUMNS: ["test_avg"],
                    ORDER: [1, 2, 3],
                }
            };
            e(q);
        });

        // Filter validation
        // LOGICCOMPARISON
        it("Filter has too many keys", async () => {
            const q = {
                WHERE: {
                    AND: [{
                        IS: { test_dept: "*" }
                    }],
                    OR: [{
                        IS: { test_dept: "*" }
                    }]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("AND value is wrong type", async () => {
            const q = {
                WHERE: {
                    AND: 123
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("AND array empty", async () => {
            const q = {
                WHERE: {
                    AND: new Array(0)
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("AND array member contains non-objects", async () => {
            const q = {
                WHERE: {
                    AND: ["not an object"]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("OR value is wrong type", async () => {
            const q = {
                WHERE: {
                    OR: 123
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("OR array member contains non-objects", async () => {
            const q = {
                WHERE: {
                    OR: ["not an object"]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("OR array empty", async () => {
            const q = {
                WHERE: {
                    OR: new Array(0)
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("AND array member contains invalid filter", async () => {
            const q = {
                WHERE: {
                    AND: [{ not_a_filter: "value" }]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        // MCOMPARISON
        it("M(ath)comparison not an object", async () => {
            const q = {
                WHERE: {
                    GT: ["this is in an array"]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("M(ath)comparison value not exactly 1 property", async () => {
            const q = {
                WHERE: {
                    GT: { test_avg: 80, test_pass: 80 }
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("M(ath)comparison not an object", async () => {
            const q = {
                WHERE: {
                    LT: ["this is in an array"]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("M(ath)comparison value not exactly 1 property", async () => {
            const q = {
                WHERE: {
                    LT: { test_avg: 80, test_pass: 80 }
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("M(ath)comparison not an object", async () => {
            const q = {
                WHERE: {
                    EQ: ["this is in an array"]
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("M(ath)comparison value not exactly 1 property", async () => {
            const q = {
                WHERE: {
                    EQ: { test_avg: 80, test_pass: 80 }
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        // SComparison
        it("S(tring)comparison not an object", async () => {
            const q = {
                WHERE: {
                    IS: 123
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("S(tring)comparison value not exactly 1 property", async () => {
            const q = {
                WHERE: {
                    IS: { test_dept: "owen", test_instructor: "owen" }
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        // Negation
        it("Negation not an object", async () => {
            const q = {
                WHERE: {
                    NOT: 123
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("Negation value is not a filter", async () => {
            const q = {
                WHERE: {
                    NOT: { Imnot: "afilter" }
                },
                OPTIONS: {
                    COLUMNS: ["test_avg"]
                }
            };
            e(q);
        });

        it("Transformations is not an object", async () => {
            const q = new Query("cc", IDK.Courses);
            q.Columns(["cc_dept"]).Transform(1);
            e(q._);
        });

        it("Transformations has GROUP but is missing APPLY", async () => {
            const q = new Query("cc", IDK.Courses);
            q.Columns(["cc_dept"]).Transform({ GROUP: ["cc_dept"]});
            e(q._);
        });

        it("Transformations has APPLY but is missing GROUP", async () => {
            const q = new Query("cc", IDK.Courses);
            q.Columns(["cc_avg"]).Transform({ APPLY: [{max: {MAX: "cc_avg"}}]});
            e(q._);
        });

        /**
         * @returns new InsightDatasetKind.Courses Query with id "cc"
         */
        const nq = () => new Query("cc", IDK.Courses);
        const cAvg = (q: Query) => q.Columns(["cc_avg"]);

        it("Transformations has too many keys", async () => {
           e(cAvg(nq()).Transform( { GROUP: ["cc_avg"], APPLY: [{max: {MAX: "cc_avg"}}], EXTRA: {}})._);
        });

        it ("TRANSFORMATIONS.GROUP must be non-empty array (but is empty array)", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: [],
                APPLY: [{max: {MAX: "cc_avg"}}]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.GROUP must be non-empty array (but is not an array)", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: 123,
                APPLY: [{max: {MAX: "cc_avg"}}]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.GROUP must be valid keys (all strings) (but one is not a string)", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: ["cc_avg", "cc_id", 123],
                APPLY: [{max: {MAX: "cc_avg"}}]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.GROUP keys must be from the right InsightDatasetKind", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: ["cc_seats"],
                APPLY: [{max: {MAX: "cc_avg"}}, {max: {MIN: "cc_avg"}}]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.APPLY must be non-empty array (but is not an array)", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: ["cc_dept"],
                APPLY: 123
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.APPLY must be all valid APPLYRULES" +
        " in this case, a mkey-only APPLYTOKEN is applied to an skey", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const validApplyRule = { max: {MAX: "cc_avg"}};
            const invalidApplyRule = { min: {MIN: "cc_dept"}};
            const transform: any = {
                GROUP: ["cc_avg"],
                APPLY: [validApplyRule, invalidApplyRule]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.APPLY must be all valid APPLYRULES" +
            " in this case, an applykey contains underscore", async () => {
                const q = nq();
                q.Columns(["cc_avg", "max"]);
                const validApplyRule = { max: {MAX: "cc_avg"}};
                const invalidApplyRule = { m_in: {MIN: "cc_avg"}};
                const transform: any = {
                    GROUP: ["cc_dept"],
                    APPLY: [validApplyRule, invalidApplyRule]
                };
                q.Transform(transform);
                e(q._);
        });

        it ("TRANSFORMATIONS.APPLY's APPLYRULE must have one key"
        , async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const invalidApplyRule = { min: {MIN: "cc_avg"}, max: {MAX: "cc_avg"}};
            const transform: any = {
                GROUP: ["cc_dept"],
                APPLY: [invalidApplyRule]
            };
            q.Transform(transform);
            e(q._);
        });

        it ("TRANSFORMATIONS.APPLY's APPLYRULE must have a field from the correct Kind"
        , async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const invalidApplyRule = { min: {MIN: "cc_seats"}};
            const transform: any = {
                GROUP: ["cc_dept"],
                APPLY: [invalidApplyRule]
            };
            q.Transform(transform);
            e(q._);
        });

        it("Transformations applykey should be unique", async () => {
            const q = nq();
            q.Columns(["cc_avg", "max"]);
            const transform: any = {
                GROUP: ["cc_avg"],
                APPLY: [{max: {MAX: "cc_avg"}}, {max: {MIN: "cc_avg"}}]
            };
            q.Transform(transform);
            e(q._);
        });

    });

    describe("query: Good Structure, Multiple Valid IDs => Invalid Query (multiple valid IDs", () => {
        const c1 = new Dataset("c1", IDK.Courses);
        const c2 = new Dataset("c2", IDK.Courses);
        const owen = AllData.fromDatasetArray([c1, c2]);

        /**
         * Expects the query to be recognized as malformed
         * @param q some malformed query
         */
        const e = (q: any) => {
            t(q).then(
                (result: any) => expect.fail(`Should have rejected with ${InsightError} instead of fulfilling`),
                (error: any) => {
                    expect(error).to.be.instanceof(InsightError);
                }
            );
        };

        const t = async (q: any): Promise<void> => {
            try {
                queryPipeline(q, owen);
            } catch (error) {
                Log.trace(error);
                throw error;
            }
        };

        // TODO (low priority)
    });
}
