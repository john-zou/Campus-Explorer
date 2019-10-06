import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";
import { KeyMap } from "../query_schema/KeyMap";
import { IQueryValidator, QueryValidationResult, QueryValidationResultFlag } from "./IQueryValidator";
import { Factory } from "./Factory";
import { InsightDatasetKind, InsightError, ResultTooLargeError } from "../controller/IInsightFacade";
import { IQuery, IOptionsWithOrder } from "../query_schema/IQuery";
import { NotImplementedError } from "restify";
import { whereFilter, orderData, removeColumns } from "./QueryPerformerFunctions";
import { ISmartQuery, ISmartFilter } from "../query_schema/ISmartQuery";
import { SmartQuery } from "../query_schema/SmartQuery";
import { ISection } from "../data/ISection";

export class QueryPerformer implements IQueryPerformer {
    private queryValidator: IQueryValidator;
    private LIMIT = 5000;

    public constructor(queryValidator: IQueryValidator = Factory.getQueryValidator()) {
        this.queryValidator = queryValidator;
    }

    public async performQuery (queryIn: any, datasets: IParsedData[], datasetsIDs: string[]): Promise<any[]> {
        // Check to make sure valid query and set id equal to result + catch error
        const validatorResult: QueryValidationResult =
            this.queryValidator.validate(queryIn, datasetsIDs, InsightDatasetKind.Courses);
        if (validatorResult.Result !== QueryValidationResultFlag.Valid) {
            // Invalid Query
            throw new InsightError(validatorResult.Result);
        }
        const id: string = validatorResult.ID;

        const query: ISmartQuery = SmartQuery.fromValidQueryJson(id, queryIn);

        // Create dataset given id
        let data: ISection[] = datasets.find((d: IParsedData) => {
            return d.id === id;
        }).data;

        // (Early) Terminate if dataset too large
        if (data.length > this.LIMIT && !query.HasFilter) {
            throw ResultTooLargeError;
        }

        let processedData: ISection[];

        // Filter Data
        if (query.HasFilter) {
            processedData = data.filter((parsedData: ISection) => {
                return whereFilter(parsedData, query.Filter);
            });
        }

        // Terminate if dataset too large
        if (processedData.length > this.LIMIT) {
            throw ResultTooLargeError;
        }

        // Sort dataset into given order
        if (query.HasOrder) {
            processedData = orderData(query.Order, processedData);
        }

        // Remove columns
        let finalData: any[] = removeColumns(query.Columns, processedData, id);

        // Return with filtered, ordered data
        return finalData;
    }
}
