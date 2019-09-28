import { InsightDatasetKind } from "../controller/IInsightFacade";

export enum QueryValidationResultFlag {
    Valid,
    NotJSON,
    MissingBody,
    MissingOptions,
    TooManyKeys_Query,
    WrongType_Body,
    WrongType_Options,
    WrongKey_Filter,
    ColumnsIsNotNonEmptyArray,
    ColumnsContainsWrongType,
    WrongType_Order,
    MissingColumns,
    InvalidKey_Options,
    TooManyKeys_Filter,
    WrongType_LogicComparison,
    WrongValue_LogicComparison,
    WrongType_MComparison,
    WrongValue_MComparison
}

export class QueryValidationResult {
    public readonly Result: QueryValidationResultFlag;
    public readonly ID: string;

    public constructor(flag: QueryValidationResultFlag, id: string) {
        this.Result = flag;
        this.ID = id;
    }
}


export interface IQueryValidator {
    // Takes in a JSON and datasetkind and returns a validation result.
    validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult;
}
