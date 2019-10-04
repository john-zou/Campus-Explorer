import { ISmartQuery, Column, ISmartFilter} from "./ISmartQuery";
import { buildSmartFilter, getColumns, getColumn } from "./SmartQueryBuildFunctions";
import { IQuery, IOptionsWithOrder } from "./IQuery";

export class SmartQuery implements ISmartQuery {
    public ID: string;
    public HasFilter: boolean;
    public HasOrder: boolean;
    public Filter?: ISmartFilter;
    public Columns: Column[];
    public Order?: Column;

    private constructor() {
        //
    }

    public static fromValidQueryJson(id: string, q: IQuery): ISmartQuery {
        const s: SmartQuery = new SmartQuery();
        s.ID = id;
        // Filter
        if (Object.keys(q.WHERE).length === 0) {
            s.HasFilter = false;
        } else {
            s.HasFilter = true;
            s.Filter = buildSmartFilter(q.WHERE);
        }
        s.Columns = getColumns(q.OPTIONS.COLUMNS);
        if (Object.keys(q.OPTIONS).includes("ORDER")) {
            s.HasOrder = true;
            s.Order = getColumn(((q.OPTIONS) as IOptionsWithOrder).ORDER);
        } else  {
            s.HasOrder = false;
        }
        return s;
    }
}
