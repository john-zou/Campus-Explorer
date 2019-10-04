import { ISmartQuery, Column, ISmartFilter} from "./ISmartQuery";
import { buildSmartFilter } from "./SmartQueryBuildFunctions";

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

    public static fromValidQueryJson(q: any): ISmartQuery {
        const s: SmartQuery = new SmartQuery();
        // Filter
        if (Object.keys(q.WHERE).length === 0) {
            s.HasFilter = false;
        } else {
            s.HasFilter = true;
            s.Filter = buildSmartFilter(q.WHERE);
        }

        return s;
    }

}
