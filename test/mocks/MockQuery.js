"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockQuery {
    constructor() {
        this.WHERE = {};
    }
    static AND1(id, filterSource) {
        const query = this.queryWithOptionsNoOrder(id);
        let and = [];
        and.push(filterSource.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }
    static AND2(id, fs1, fs2) {
        const query = this.queryWithOptionsNoOrder(id);
        let and = [];
        and.push(fs1.WHERE);
        and.push(fs2.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }
    static AND3(id, fs1, fs2, fs3) {
        const query = this.queryWithOptionsNoOrder(id);
        let and = [];
        and.push(fs1.WHERE);
        and.push(fs2.WHERE);
        and.push(fs3.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }
    static OR1(id, filterSource) {
        const query = this.queryWithOptionsNoOrder(id);
        let or = [];
        or.push(filterSource.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }
    static OR2(id, fs1, fs2) {
        const query = this.queryWithOptionsNoOrder(id);
        let or = [];
        or.push(fs1.WHERE);
        or.push(fs2.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }
    static OR3(id, fs1, fs2, fs3) {
        const query = this.queryWithOptionsNoOrder(id);
        let or = [];
        or.push(fs1.WHERE);
        or.push(fs2.WHERE);
        or.push(fs3.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }
    static NOT(id, filterSource) {
        const query = this.queryWithOptionsNoOrder(id);
        let not = filterSource.WHERE;
        query.WHERE = {
            NOT: not
        };
        return query;
    }
    static GT_Avg_95(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let gt = {};
        gt[id + "_avg"] = 95;
        query.WHERE = {
            GT: gt
        };
        return query;
    }
    static LT_Avg_95(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let lt = {};
        lt[id + "_avg"] = 95;
        query.WHERE = {
            LT: lt
        };
        return query;
    }
    static EQ_Avg_95(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let eq = {};
        eq[id + "_avg"] = 95;
        query.WHERE = {
            EQ: eq
        };
        return query;
    }
    static IS_Dept_yy(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "yy";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_yyy(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "yyy";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_Xyy(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "*yy";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_yyX(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "yy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_XyyX(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "*yy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_XyyyX(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "*yyy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_X(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "*";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static IS_Dept_XX(id) {
        const query = this.queryWithOptionsNoOrder(id);
        let is = {};
        is[id + "_dept"] = "**";
        query.WHERE = {
            IS: is
        };
        return query;
    }
    static queryWithOptionsNoOrder(id) {
        const query = new MockQuery();
        let options = {};
        let columns = [id + "_avg", id + "_dept", id + "_uuid"];
        options.COLUMNS = columns;
        query.OPTIONS = options;
        return query;
    }
}
exports.MockQuery = MockQuery;
//# sourceMappingURL=MockQuery.js.map