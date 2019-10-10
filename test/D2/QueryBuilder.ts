import { InsightDatasetKind } from "../../src/controller/IInsightFacade";

// For testing purposes
export class Query {
    public ID: string;
    public Kind: InsightDatasetKind;
    public _: any = {};

    public constructor(id: string, kind: InsightDatasetKind) {
        this.ID = id;
        this.Kind = kind;
    }

    public Where(f: any): Query {
        this._.WHERE = f;
        return this;
    }

    public Columns(c: string[]): Query {
        this._.OPTIONS.COLUMNS = c;
        return this;
    }

    public Order(o: any): Query {
        this._.OPTIONS.ORDER = o;
        return this;
    }

    public Transform(t: any): Query {
        this._.TRANSFORMATIONS = t;
        return this;
    }
}
