import { InsightDatasetKind } from "../controller/IInsightFacade";

export enum QueryValidationResultFlag {
    Valid,
    MissingBody,
    MissingOptions,
    TooManyKeys_Query,
    WrongType_Body,
    WrongType_Options,
    WrongKey_Filter,
    ColumnsIsNotNonEmptyArray,
    ColumnsContainsWrongType,
    MissingColumns,
    TooManyKeys_Filter,
    WrongType_LogicComparison,
    WrongValue_LogicComparison,
    WrongType_MComparison,
    WrongValue_MComparison,
    WrongType_SComparison,
    WrongValue_SComparison,
    // WrongType_Negation,
    IdDoesNotExist,
    MoreThanOneId,
    TooManyKeys_MComparison,
    TooManyUnderscores,
    NoUnderscore,
    NoIdstring,
    NoKeyfield,
    InvalidMField,
    MValueNotANumber,
    TooManyKeys_SComparison,
    InvalidSField,
    TooManyKeys_Options,
    ColumnContainsInvalidField,
    OrderContainsInvalidField,
    OrderContainsFieldNotInColumns,
    SValueNotAString,
    SValueContainsInternalAsterisk,
    WrongType_Order,
    HasNoKeys_MComparison,
    HasNoKeys_SComparison,
    IdStringIsAllWhitespace,
    SValueIsEmptyString,
    QueryIsNotAnObject,
    HasNoKeys_Filter,
    EmptySField,
    EmptyMField,
    EmptyField
}

export class QueryValidationResult {
    public readonly Result: QueryValidationResultFlag;
    public readonly ID: string;

    public constructor(flag: QueryValidationResultFlag, id: string = null) {
        this.Result = flag;
        this.ID = id;
    }
}

export interface IQueryValidator {
    // Takes in a JSON and datasetkind and returns a validation result.
    validate(json: any, datasetIds: string[], kind: InsightDatasetKind): QueryValidationResult;
}
