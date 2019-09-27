import { InsightDatasetKind } from "../controller/IInsightFacade";

/**
 * Listed in order of precedence
 * 
 * */
export enum QueryValidationResult {
    Valid,
    NotJSON,
    MissingBody,
    MissingOptions,
    TooManyKeys_Query,
    WrongType_Body,
    WrongType_Options,
    // Too many keys at the query level (i.e. has body, has options, then has st xtra)

    // not really possible but we need this validate takes in "any"
    // todo: add more
}


export interface IQueryValidator {
    // Takes in a JSON and datasetkind and returns a validation result.
    validate(json: any, datasetId: string, kind: InsightDatasetKind): QueryValidationResult;
}
