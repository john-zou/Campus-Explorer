import { IParsedData } from "../data/IParsedData";

export interface IQueryPerformer {
    performQuery(query: any, datasets: IParsedData[], datasetsIDs: string[]): Promise<any[]>;
}
