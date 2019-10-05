import { IQuery, IFilter, IOptions } from "../../src/query_schema/IQuery";

/**
 * Used for testing QueryPerformer.
 * This class only generates queries about avg and dept
 * UUID is always requested for testing convenience
 */
export class MockQuery implements IQuery {
    public WHERE: IFilter | {} = {};
    public OPTIONS: IOptions;

    // LogicComparison filters
    public static AND1(id: string, filterSource: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let and: any[] = [];
        and.push(filterSource.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }

    public static AND2(id: string, fs1: MockQuery, fs2: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let and: any[] = [];
        and.push(fs1.WHERE);
        and.push(fs2.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }

    public static AND3(id: string, fs1: MockQuery, fs2: MockQuery, fs3: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let and: any[] = [];
        and.push(fs1.WHERE);
        and.push(fs2.WHERE);
        and.push(fs3.WHERE);
        query.WHERE = {
            AND: and
        };
        return query;
    }

    public static OR1(id: string, filterSource: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let or: any[] = [];
        or.push(filterSource.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }

    public static OR2(id: string, fs1: MockQuery, fs2: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let or: any[] = [];
        or.push(fs1.WHERE);
        or.push(fs2.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }

    public static OR3(id: string, fs1: MockQuery, fs2: MockQuery, fs3: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let or: any[] = [];
        or.push(fs1.WHERE);
        or.push(fs2.WHERE);
        or.push(fs3.WHERE);
        query.WHERE = {
            OR: or
        };
        return query;
    }

    public static NOT(id: string, filterSource: MockQuery): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let not: IFilter = filterSource.WHERE as IFilter;
        query.WHERE = {
            NOT: not
        };
        return query;
    }

    // Leaf filters
    public static GT_Avg_95(id: string): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let gt: any = {};
        gt[id + "_avg"] = 95;
        query.WHERE = {
            GT: gt
        };
        return query;
    }

    public static LT_Avg_95(id: string): IQuery {
        const query: IQuery = this.queryWithOptionsNoOrder(id);
        let lt: any = {};
        lt[id + "_avg"] = 95;
        query.WHERE = {
            LT: lt
        };
        return query;
    }

    public static EQ_Avg_95(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let eq: any = {};
        eq[id + "_avg"] = 95;
        query.WHERE = {
            EQ: eq
        };
        return query;
    }

    public static IS_Dept_yy(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "yy";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    public static IS_Dept_yyy(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "yyy";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_Xyy(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "*yy";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_yyX(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "yy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_XyyX(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "*yy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_XyyyX(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "*yyy*";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_X(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "*";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    /**
     * Note: the X stands for asterisk
     */
    public static IS_Dept_XX(id: string): MockQuery {
        const query = this.queryWithOptionsNoOrder(id);
        let is: any = {};
        is[id + "_dept"] = "**";
        query.WHERE = {
            IS: is
        };
        return query;
    }

    private static queryWithOptionsNoOrder(id: string): MockQuery {
        const query = new MockQuery();
        let options: any = {};
        let columns: string[] = [id + "_avg", id + "_dept", id + "_uuid"];
        options.COLUMNS = columns;
        query.OPTIONS = options;
        return query;
    }
}
