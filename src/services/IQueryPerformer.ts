import { IParsedData } from "../data/IParsedData";
import { AllData } from "../data/AllData";

export interface IQueryPerformer {
    performQuery(query: any, owen: AllData): Promise<any[]>;
}
