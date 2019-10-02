import { IQueryValidator, QueryValidationResult as R, QueryValidationResultFlag as F } from "./IQueryValidator";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { validateFilter, parseKeystring, hasTooManyKeys, isMissingKey } from "./QueryValidationFunctions_Body";
import { validateOptions } from "./QueryValidationFunctions_Options";

export class QueryValidator implements IQueryValidator {
    public validate(json: any, datasetIds: string[], kind: InsightDatasetKind): R {
        if (json == null || typeof json !== "object") {
            return new R(F.QueryIsNotAnObject);
        }
        if (isMissingKey(json, "WHERE")) {
            return new R(F.MissingBody);
        }
        if (isMissingKey(json, "OPTIONS")) {
            return new R(F.MissingOptions);
        }
        if (hasTooManyKeys(json, 2)) {
            return new R(F.TooManyKeys_Query);
        }
        // WrongType_Body -- BODY in EBNF is property WHERE
        const where = json.WHERE;
        if (where == null || typeof where !== "object") {
            return new R(F.WrongType_Body);
        }
        // WrongType_Options
        const options = json.OPTIONS;
        if (options == null || typeof options !== "object") {
            return new R(F.WrongType_Options);
        }
        let whereMentionsId: boolean = false;
        let id: string = "";
        // if .WHERE is not just empty object { }
        if (Object.keys(where).length !== 0) {
            // .WHERE must be a good filter
            const filterValidationResult: [F, string] = validateFilter(where, datasetIds);
            const filterValidationFlag: F = filterValidationResult[0];
            if (filterValidationFlag !== F.Valid) {
                return new R(filterValidationFlag);
            }
            // This ID is guaranteed to be in datasetIds
            id = filterValidationResult[1]; // Remember the ID to compare with options
            whereMentionsId = true; // This ID will then be matched against that from options
        }
        // Validate Options
        const optionsValidationResult: [F, string] = validateOptions(options, datasetIds);
        const optionsValidationFlag: F = optionsValidationResult[0];
        if (optionsValidationFlag !== F.Valid) {
            return new R(optionsValidationFlag);
        }
        // This ID is guaranteed to be in datasetIDs as well but it doesn't matter since
        // it will be compared to the ID from earlier
        const idFromOptions: string = optionsValidationResult[1];
        if (whereMentionsId) { // Compare the IDs from both parts of the query
            if (id !== idFromOptions) {
                return new R(F.MoreThanOneId);
            }
        }
        return new R(F.Valid, idFromOptions);
    }
}
