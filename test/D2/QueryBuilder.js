"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Query {
    constructor(id, kind) {
        this._ = {};
        this.ID = id;
        this.Kind = kind;
    }
    Where(f) {
        this._.WHERE = f;
        return this;
    }
    Columns(c) {
        this._.OPTIONS.COLUMNS = c;
        return this;
    }
    Order(o) {
        this._.OPTIONS.ORDER = o;
        return this;
    }
    Transform(t) {
        this._.TRANSFORMATIONS = t;
        return this;
    }
}
exports.Query = Query;
//# sourceMappingURL=QueryBuilder.js.map