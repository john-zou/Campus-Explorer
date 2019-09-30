import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";

export class QueryPerformer implements IQueryPerformer {
    private queryWhere: any;

    public async performQuery (query: any, datasets: IParsedData[], datasetsIDs: string[]): Promise<any[]> {
        // Check to make sure valid query and set id equal to result + catch error
        let id = "";

        // Create ordered data set
        let sortedData: IParsedData = datasets.find((d: IParsedData) => {
            return d.id === id;
        });

        if (query["options"].keys().includes("order")) {
            sortedData = await this.orderData(query["options"]["order"], sortedData);
        }

        // Set field
        this.queryWhere = query["where"];

        // Return with filtered, ordered data
        return Promise.resolve(sortedData.data.filter(this.filterWhere));
    }

    // Order dataset according to parameter in order
    private orderData (order: any, dataset: IParsedData): Promise <IParsedData> {
        // Check for null/undefined order parameter
        if (order === null || order === undefined) {
            return Promise.reject(); // Bad key
        }
        return Promise.reject("Not implemented error");
    }

    // Returns if data is in where, wrapper for recursive function
    private filterWhere (parsedData: any): boolean {
        return this.filterWhereRec(parsedData, this.queryWhere);
    }

    private filterWhereRec (parsedData: any, where: any): boolean {
        return false;
        // pseudo code
        // if (leaf in where)
        //  return true or false
        // else
        //  some logical combination of filterWhereRec calls on children
    }
}
