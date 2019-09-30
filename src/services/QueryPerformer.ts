import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";
import { KeyMap } from "../query_schema/KeyMap";
import { IQueryValidator, QueryValidationResult, QueryValidationResultFlag } from "./IQueryValidator";
import { Factory } from "./Factory";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";

export class QueryPerformer implements IQueryPerformer {
    private queryValidator: IQueryValidator;
    private queryWhere: any;
    // Note that all implementation uses case insensitivity

    public constructor(queryValidator: IQueryValidator = Factory.getQueryValidator()) {
        this.queryValidator = queryValidator;
    }

    public async performQuery (query: any, datasets: IParsedData[], datasetsIDs: string[]): Promise<any[]> {
        // Check to make sure valid query and set id equal to result + catch error
        const validatorResult: QueryValidationResult =
            this.queryValidator.validate(query, datasetsIDs, InsightDatasetKind.Courses);
        if (validatorResult.Result !== QueryValidationResultFlag.Valid) {
            return Promise.reject(new InsightError(validatorResult.Result));
        }
        const id: string = validatorResult.ID;
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
        let orderKey: string = order.split("_")[1];
        // dataset.data = dataset.data.sort((a:any, b:any) => {
        //     // with a little help from https://mzl.la/2ospbkN
        // });

        return Promise.resolve(dataset);
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
