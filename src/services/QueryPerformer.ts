import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";
import { KeyMap } from "../query_schema/KeyMap";
import { IQueryValidator, QueryValidationResult, QueryValidationResultFlag } from "./IQueryValidator";
import { Factory } from "./Factory";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { IQuery, IOptionsWithOrder } from "../query_schema/IQuery";

export class QueryPerformer implements IQueryPerformer {
    private queryValidator: IQueryValidator;
    private queryWhere: any;

    public constructor(queryValidator: IQueryValidator = Factory.getQueryValidator()) {
        this.queryValidator = queryValidator;
    }

    public async performQuery (queryIn: any, datasets: IParsedData[], datasetsIDs: string[]): Promise<any[]> {
        // Check to make sure valid query and set id equal to result + catch error
        const validatorResult: QueryValidationResult =
            this.queryValidator.validate(queryIn, datasetsIDs, InsightDatasetKind.Courses);
        if (validatorResult.Result !== QueryValidationResultFlag.Valid) {
            // Invalid Query
            return Promise.reject(new InsightError(QueryValidationResultFlag[validatorResult.Result]));
        }
        const id: string = validatorResult.ID;

        let query: IQuery = queryIn;
        // Create dataset given id
        let sortedData: IParsedData = datasets.find((d: IParsedData) => {
            return d.id === id;
        });

        // Sort dataset into given order
        if (Object.keys(query.OPTIONS).includes("ORDER")) {
            sortedData = await this.orderData((query.OPTIONS as IOptionsWithOrder).ORDER, sortedData);
        }

        // Set field
        this.queryWhere = query["WHERE"];

        // Return with filtered, ordered data
        return Promise.resolve(sortedData.data.filter(this.filterWhere));
    }

    // Order dataset according to parameter in order
    private orderData (order: any, dataset: IParsedData): Promise <IParsedData> {
        let orderKey: string = order.split("_")[1];
        dataset.data = dataset.data.sort((a: any, b: any) => {
            // with a little help from https://mzl.la/2ospbkN
            if (a.orderKey === Number) {
                return a.orderKey - b.orderKey;
            } else {
                return a.orderKey.toUpperCase() - b.orderKey.toUpperCase();
            }
        });
        return Promise.resolve(dataset);
    }

    // Returns if data is in where, wrapper for recursive function
    private filterWhere (parsedData: any): boolean {
        return this.filterWhereRec(parsedData, this.queryWhere);
    }

    private filterWhereRec (parsedData: any, where: any): boolean {
        return true;
        // pseudo code
        // if (leaf in where)
        //  return true or false
        // else
        //  some logical combination of filterWhereRec calls on children
    }
}
