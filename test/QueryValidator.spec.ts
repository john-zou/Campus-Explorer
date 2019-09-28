import { QueryValidator } from "../src/services/QueryValidator";
import { InsightDatasetKind } from "../src/controller/IInsightFacade";
import { expect } from "chai";
import { QueryValidationResult as Res, QueryValidationResultFlag as R } from "../src/services/IQueryValidator";
/* tslint:disable */
// Module Test Skeleton

// Import Statements

describe("QueryValidator Tests: Insane Invalid Query", () => {
    // Declare common objects as local variables
    // Initialize a QueryValidator. It's stateless so we can just test using this one
    const v: QueryValidator = new QueryValidator();
    const idStrings: string[] = ["test"];

    // helper
    const t = (q: any, res: R): void => {
        expect(v.validate(q, idStrings, InsightDatasetKind.Courses).Result).to.equal(res)
    };


    it("Not JSON format", async () => {
        const q: string = "not a json object";
        t(q, R.NotJSON);
    });

    it("Missing body", async () => {
        const q = {
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.MissingBody);
    });

    it("Missing options", async () => {
        const q = {
            "WHERE": {}
        };
        t(q, R.MissingOptions);
    });

    it("Has too many keys", async () => {
        const q = {
            "WHERE": {}, "OPTIONS": { "COLUMNS": "test_avg" }, "extraneous_key": "value"
        };
        t(q, R.TooManyKeys_Query);
    });

    it("Body is wrong type", async () => {
        const q = {
            "WHERE": "wrong type", "OPTIONS": { "COLUMNS": ["test_avg"] }
        };
        t(q, R.WrongType_Body);
    });

    it("Options is wrong type", async () => {
        const q = {
            "WHERE": {}, "OPTIONS": "wrong type"
        };
        t(q, R.WrongType_Options);
    });

    it("Options is missing columns", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": {

            }
        }
        t(q, R.MissingColumns);
    });

    it("Options has invalid key", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["test_avg"],
                "invalid_key": "value"
            }
        };
        t(q, R.InvalidKey_Options);
    })

    it("Filter has wrong key", async () => {
        const q = {
            "WHERE": { wrong_key: "lol" },
            "OPTIONS": { "COLUMNS": ["test_avg"] }
        };
        t(q, R.WrongKey_Filter);
    });

    it("Columns is not array", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": 123,
            }
        };
        t(q, R.ColumnsIsNotNonEmptyArray);
    });

    it("Columns contains non-string (i.e. obj or array)", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": { "COLUMNS": ["test_avg", [1, 2, 3]] }
        };
        t(q, R.ColumnsContainsWrongType);
    });

    it("Columns contains non-string (i.e. obj or array)", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": { "COLUMNS": ["test_avg", { "key": "value" }] }
        };
        t(q, R.ColumnsContainsWrongType);
    });

    it("Order is wrong type", async () => {
        const q = {
            "WHERE": {},
            "OPTIONS": {
                "COLUMNS": ["test_avg"],
                "ORDER": [1, 2, 3],
            }
        };
        t(q, R.WrongType_Order);
    });

    // Filter validation
    // LOGICCOMPARISON
    it("Filter has too many keys", async () => {
        const q = {
            "WHERE": {
                "AND": [{
                    "IS": { "test_dept": "*" }
                }],
                "OR": [{
                    "IS": { "test_dept": "*" }
                }]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.TooManyKeys_Filter);
    });

    it("AND value is wrong type", async () => {
        const q = {
            "WHERE": {
                "AND": 123
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongType_LogicComparison);
    });

    it("AND array member contains non-objects", async () => {
        const q = {
            "WHERE": {
                "AND": ["not an object"]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_LogicComparison);
    });

    it("OR value is wrong type", async () => {
        const q = {
            "WHERE": {
                "OR": 123
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongType_LogicComparison);
    });

    it("OR array member contains non-objects", async () => {
        const q = {
            "WHERE": {
                "OR": ["not an object"]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_LogicComparison);
    });

    it("AND array member contains invalid filter", async () => {
        const q = {
            "WHERE": {
                "AND": [{ "not_a_filter": "value" }]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongKey_Filter);
    });

    //MCOMPARISON
    it("M(ath)comparison not an object", async () => {
        const q = {
            "WHERE": {
                "GT": ["this is in an array"]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        }
        t(q, R.WrongType_MComparison);
    });

    it("M(ath)comparison value not exactly 1 property", async () => {
        const q = {
            "WHERE": {
                "GT": { "test_avg": 80, "test_pass": 80 }
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_MComparison);
    });

    it("M(ath)comparison not an object", async () => {
        const q = {
            "WHERE": {
                "LT": ["this is in an array"]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        }
        t(q, R.WrongType_MComparison);
    });

    it("M(ath)comparison value not exactly 1 property", async () => {
        const q = {
            "WHERE": {
                "LT": { "test_avg": 80, "test_pass": 80 }
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_MComparison);
    });

    it("M(ath)comparison not an object", async () => {
        const q = {
            "WHERE": {
                "EQ": ["this is in an array"]
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        }
        t(q, R.WrongType_MComparison);
    });

    it("M(ath)comparison value not exactly 1 property", async () => {
        const q = {
            "WHERE": {
                "EQ": { "test_avg": 80, "test_pass": 80 }
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_MComparison);
    });

    // SComparison
    it("S(tring)comparison not an object", async () => {
        const q = {
            "WHERE": {
                "IS": 123
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongType_SComparison);
    });

    it("S(tring)comparison value not exactly 1 property", async () => {
        const q = {
            "WHERE": {
                "IS": { "test_dept": "owen", "test_instructor": "owen" }
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongValue_SComparison);
    });

    // Negation
    it("Negation not an object", async () => {
        const q = {
            "WHERE": {
                "NOT": 123
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongType_Negation);
    });

    it("Negation value is not a filter", async () => {
        const q = {
            "WHERE": {
                "NOT": { "Imnot": "afilter" }
            },
            "OPTIONS": {
                "COLUMNS": ["test_avg"]
            }
        };
        t(q, R.WrongKey_Filter);
    });
});

describe("QueryValidator Tests: Sane Invalid Query: ID problems", () => {
    const v: QueryValidator = new QueryValidator();
    const idStrings: string[] = ["test1", "test2"];

    // helper
    const t = (q: any, res: R): void => {
        expect(v.validate(q, idStrings, InsightDatasetKind.Courses).Result).to.equal(res)
    };

    it("multiple valid IDs", async () => {

    });
});

describe("QueryValidator Tests: Sane Invalid Query: Column Problems", () => {

});

describe("QueryValidator Tests: Sane Invalid Query: Too many results", () => {

});
