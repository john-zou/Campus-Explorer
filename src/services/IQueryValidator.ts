import { InsightDatasetKind, InsightDataset } from "../controller/IInsightFacade";
import { AllData } from "../data/AllData";
import Insight from "../util/Insight";

export enum QueryValidationResultFlag {
    Valid = "Valid",
    MissingBody = "Body (WHERE) is missing",
    MissingOptions = "Options (OPTIONS) is missing",
    TooManyKeys_Query = "Query has too many keys",
    WrongType_Body = "Body (WHERE) must be an object",
    WrongType_Options = "Options (OPTIONS) must be an object",
    WrongKey_Filter = "Filter key needs to be IS/AND/GT/ etc.",
    ColumnsIsNotNonEmptyArray = "COLUMNS value needs to be a non-empty array",
    ColumnsContainsWrongType = "COLUMNS array must contain only strings",
    MissingColumns = "COLUMNS is missing",
    TooManyKeys_Filter = "Filter can only have one key",
    WrongType_LogicComparison = "LogicComparison value needs to be an array",
    WrongValue_LogicComparison = "Filter needs to be an object",
    WrongType_MComparison = "MComparison needs to be an object",
    WrongValue_MComparison = "MComparison value needs to be a number",
    WrongType_SComparison = "SComparison needs to be an object",
    WrongValue_SComparison = "SComparison value needs to be a string",
    IdDoesNotExist = "ID must be in datasets",
    MoreThanOneId = "Only one ID allowed in query",
    TooManyKeys_MComparison = "MComparison needs to have exactly 1 key",
    TooManyUnderscores = "Too many underscores -- exactly 1 required",
    NoUnderscore = "No underscore -- exactly 1 required",
    NoIdstring = "Empty string preceding underscore",
    NoKeyfield = "Empty string following underscore",
    InvalidMField = "Invalid MField",
    MValueNotANumber = "MValue needs to be a number",
    TooManyKeys_SComparison = "SComparison has too many keys; needs to have exactly 1 key",
    InvalidSField = "Invalid SField",
    TooManyKeys_Options = "Options has too many keys",
    ColumnContainsInvalidField = "Column contains invalid field",
    OrderContainsInvalidField = "Order contains invalid field",
    OrderNotInColumns = "Order contains field not in columns",
    SValueNotAString = "SValue needs to be a string",
    SValueContainsInternalAsterisk = "SValue cannot contain an internal asterisk",
    WrongType_Order = "Order must be a string",
    HasNoKeys_MComparison = "MComparison has no keys; needs to have 1 key",
    HasNoKeys_SComparison = "SComparison has no keys; needs to have 1 key",
    IdStringIsAllWhitespace = "IDString can't be only whitespace",
    HasNoKeys_Filter = "Filter has no keys; needs to have 1 key",
    EmptySField = "SField cannot be empty",
    EmptyMField = "MField cannot be empty",
    EmptyField = "S/M Field cannot be empty",
    Empty_LogicComparison = "LogicComparison must be nonempty array",
    TransformationsIsNotAnObject = "TransformationsIsNotAnObject",
    TransformationsDoesntHaveTwoKeys = "TransformationsDoesntHaveTwoKeys",
    TransformationsIsMissingGroup = "TransformationsIsMissingGroup",
    GroupIsNotAnArray = "GroupIsNotAnArray",
    GroupMustBeNonEmptyArray = "GroupMustBeNonEmptyArray",
    ApplyIsNotAnArray = "ApplyIsNotAnArray",
    ApplyMustBeNonEmptyArray = "ApplyMustBeNonEmptyArray",
    InvalidKey = "InvalidKey",
    KeystringIsNotAString = "KeystringIsNotAString",
    ApplyRuleMustBeAnObject = "ApplyRuleMustBeAnObject",
    ApplyRuleMustHaveExactlyOneKey = "ApplyRuleMustHaveExactlyOneKey",
    ApplyKeysMustBeUnique = "ApplyKeysMustBeUnique",
    ApplyKeyCoreMustBeObject = "ApplyKeyValueMustBeObject",
    ApplyKeyValueMustHaveOneKey = "ApplyKeyValueMustHaveOneKey",
    ApplyKeyCore_Is_Invalid = "ApplyKeyValueMustHaveApplytokenKey",
    ApplyKeyKeyTokenHasInvalidKey = "ApplyKeyKeyTokenHasInvalidKey",
    InvalidApplyRule = "InvalidApplyRule",
    ApplyKeyCoreMustHaveOneKey = "ApplyKeyCoreMustHaveOneKey",
    ApplyKeyContainsUnderscore = "ApplyKeyContainsUnderscore",
    ColumnWithoutUnderscoreNotInApplyKeys = "ColumnWithoutUnderscoreNotInApplyKeys",
    ColumnContainsFieldNotInGroupFields = "ColumnContainsFieldNotInGroupFields",
    TooManyKeys_Order = "TooManyKeys_Order",
    OrderMissingDir = "OrderMissingDir",
    OrderMissingKeys = "OrderMissingKeys",
    InvalidOrderDir = "InvalidOrderDir",
    OrderKeysIsNotNonEmptyArray = "OrderKeysIsNotNonEmptyArray",
    OrderContainsKeyNotInColumns = "OrderContainsKeyNotInColumns",
    TransformationsIsMissingApply = "TransformationsIsMissingApply",
    ApplyTokenCannotBeAppliedToSField = "ApplyTokenCannotBeAppliedToSField",
    ApplyKeyMustBeNonEmptyString = "ApplyKeyMustBeNonEmptyString"
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
    validate(json: any, owen: AllData): QueryValidationResult;
}
