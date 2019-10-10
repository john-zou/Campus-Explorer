import { InsightDatasetKind, InsightError } from "../../src/controller/IInsightFacade";
import { expect } from "chai";
import { QueryValidationResult as Res, QueryValidationResultFlag as R } from "../../src/services/IQueryValidator";
import { OwensReality } from "../../src/data/OwensReality";
import { ActualDataset } from "../../src/data/ActualDataset";
import Insight from "../../src/util/Insight";
import { getIdIfValid } from "../../src/D2/query/Validate";
import { Query } from "./QueryBuilder";

// Adapted for D2 -- testing the getIdIfValid function

describe("getIdIfValid: Bad Structure => Invalid Query", () => {
    const coursesDb = new ActualDataset("cc", InsightDatasetKind.Courses);
    const roomsDb = new ActualDataset("rr", InsightDatasetKind.Rooms);
    const owen = OwensReality.fromDatasetArray([coursesDb, roomsDb]);

    const e = (q: any) => {
        t(q).then(
            (result: any) => expect.fail(`Should have rejected with ${InsightError} instead of fulfilling`),
            (error: any) => {
                expect(error).to.be.instanceof(InsightError);
            }
        );
    };

    const t = async (q: any): Promise<void> => {
        await getIdIfValid(q, owen);
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
        let q = new Query("cc", InsightDatasetKind.Courses);
        q = q.Where({}).Columns(["cc_dept"]).Transform(1);
        e(q._);
    });
});
