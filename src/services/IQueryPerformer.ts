import { IParsedData } from "../data/IParsedData";
import { OwensReality } from "../data/OwensReality";

export interface IQueryPerformer {
    performQuery(query: any, owen: OwensReality): Promise<any[]>;
}
