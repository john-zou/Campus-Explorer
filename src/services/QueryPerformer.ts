import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";
import { KeyMap } from "../query_schema/KeyMap";
import { IQueryValidator, QueryValidationResult, QueryValidationResultFlag } from "./IQueryValidator";
import { Factory } from "./Factory";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { IQuery, IOptionsWithOrder } from "../query_schema/IQuery";
import { NotImplementedError } from "restify";
import { whereFilter, orderData } from "./QueryPerformerFunctions";
import { ISmartQuery } from "../query_schema/ISmartQuery";
import { SmartQuery } from "../query_schema/SmartQuery";

export class QueryPerformer implements IQueryPerformer {
    private queryValidator: IQueryValidator;
    private queryWhere: any;
    private MCOMPARISON: string[] = ["LT", "GT", "EQ"];
    private SCOMPARISON: string[] = ["IS"];
    private LOGIC: string[] = ["AND", "OR"];

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

        const query: ISmartQuery = SmartQuery.fromValidQueryJson(id, queryIn);

        // Create dataset given id
        let sortedData: IParsedData = datasets.find((d: IParsedData) => {
            return d.id === id;
        });

        // // Sort dataset into given order
        // if (Object.keys(query.Columns).includes("ORDER")) {
        //     sortedData = await orderData((query.OPTIONS as IOptionsWithOrder).ORDER, sortedData);
        // }

        // // Set field
        // this.queryWhere = query["WHERE"];

        // Return with filtered, ordered data
        return Promise.resolve(sortedData.data.filter(this.filterWhere));
    }

    // Returns if data is in where, wrapper for recursive function
    private filterWhere (parsedData: any): boolean {
        return whereFilter(parsedData, this.queryWhere);
    }
}
