"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const IInsightFacade_1 = require("../../src/controller/IInsightFacade");
const chai_1 = require("chai");
const OwensReality_1 = require("../../src/data/OwensReality");
const ActualDataset_1 = require("../../src/data/ActualDataset");
const Validate_1 = require("../../src/D2/query/Validate");
const QueryBuilder_1 = require("./QueryBuilder");
describe("getIdIfValid: Bad Structure => Invalid Query", () => {
    const coursesDb = new ActualDataset_1.ActualDataset("cc", IInsightFacade_1.InsightDatasetKind.Courses);
    const roomsDb = new ActualDataset_1.ActualDataset("rr", IInsightFacade_1.InsightDatasetKind.Rooms);
    const owen = OwensReality_1.OwensReality.fromDatasetArray([coursesDb, roomsDb]);
    const e = (q) => {
        t(q).then((result) => chai_1.expect.fail(`Should have rejected with ${IInsightFacade_1.InsightError} instead of fulfilling`), (error) => {
            chai_1.expect(error).to.be.instanceof(IInsightFacade_1.InsightError);
        });
    };
    const t = (q) => __awaiter(this, void 0, void 0, function* () {
        yield Validate_1.getIdIfValid(q, owen);
    });
    it("Missing body", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("Missing options", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {}
        };
        e(q);
    }));
    it("Has too many keys", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {}, OPTIONS: { COLUMNS: "test_avg" }, extraneous_key: "value"
        };
        e(q);
    }));
    it("Body is wrong type", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: "wrong type", OPTIONS: { COLUMNS: ["test_avg"] }
        };
        e(q);
    }));
    it("Options is wrong type", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {}, OPTIONS: "wrong type"
        };
        e(q);
    }));
    it("Options is missing columns", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {},
            OPTIONS: {}
        };
        e(q);
    }));
    it("Options has invalid key", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {},
            OPTIONS: {
                COLUMNS: ["test_avg"],
                invalid_key: "value"
            }
        };
        e(q);
    }));
    it("Filter has wrong key", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: { wrong_key: "lol" },
            OPTIONS: { COLUMN: ["test_avg"] }
        };
        e(q);
    }));
    it("Columns is not array", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {},
            OPTIONS: {
                COLUMNS: 123,
            }
        };
        e(q);
    }));
    it("Order is wrong type", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {},
            OPTIONS: {
                COLUMNS: ["test_avg"],
                ORDER: [1, 2, 3],
            }
        };
        e(q);
    }));
    it("Filter has too many keys", () => __awaiter(this, void 0, void 0, function* () {
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
    }));
    it("AND value is wrong type", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                AND: 123
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("AND array empty", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                AND: new Array(0)
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("AND array member contains non-objects", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                AND: ["not an object"]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("OR value is wrong type", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                OR: 123
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("OR array member contains non-objects", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                OR: ["not an object"]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("OR array empty", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                OR: new Array(0)
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("AND array member contains invalid filter", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                AND: [{ not_a_filter: "value" }]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison not an object", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                GT: ["this is in an array"]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison value not exactly 1 property", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                GT: { test_avg: 80, test_pass: 80 }
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison not an object", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                LT: ["this is in an array"]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison value not exactly 1 property", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                LT: { test_avg: 80, test_pass: 80 }
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison not an object", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                EQ: ["this is in an array"]
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("M(ath)comparison value not exactly 1 property", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                EQ: { test_avg: 80, test_pass: 80 }
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("S(tring)comparison not an object", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                IS: 123
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("S(tring)comparison value not exactly 1 property", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                IS: { test_dept: "owen", test_instructor: "owen" }
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("Negation not an object", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                NOT: 123
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("Negation value is not a filter", () => __awaiter(this, void 0, void 0, function* () {
        const q = {
            WHERE: {
                NOT: { Imnot: "afilter" }
            },
            OPTIONS: {
                COLUMNS: ["test_avg"]
            }
        };
        e(q);
    }));
    it("Transformations is not an object", () => __awaiter(this, void 0, void 0, function* () {
        let q = new QueryBuilder_1.Query("cc", IInsightFacade_1.InsightDatasetKind.Courses);
        q = q.Where({}).Columns(["cc_dept"]).Transform(1);
        e(q._);
    }));
});
//# sourceMappingURL=getIdIfValid.spec.js.map