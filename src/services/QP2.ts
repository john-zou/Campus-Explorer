import { IQueryPerformer } from "./IQueryPerformer";
import { IParsedData } from "../data/IParsedData";
import { QueryValidator } from "./QueryValidator";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { QueryValidationResultFlag } from "./IQueryValidator";
import { SmartQuery } from "../query_schema/SmartQuery";
import { IQuery } from "../query_schema/IQuery";
import { ISection } from "../data/ISection";
import { ISmartFilter, FilterType, ILogicComparison, IMComparison,
    ISComparison, INegation, Logic, MField, MComparator, SField,
    ColumnType, ISmartQuery } from "../query_schema/ISmartQuery";
import { isMatch, sortByKey } from "./StringMatch";

export class QP2 implements IQueryPerformer {
    private queryValidator: QueryValidator = new QueryValidator();

    public async performQuery(query: any, datasets: IParsedData[], datasetIDs: string[]): Promise<any[]> {
        const validationResult = this.queryValidator.validate(query, datasetIDs, InsightDatasetKind.Courses);
        if (validationResult.Result !== QueryValidationResultFlag.Valid) {
            throw new InsightError(QueryValidationResultFlag[validationResult.Result]);
        }
        const id = validationResult.ID;
        const q = SmartQuery.fromValidQueryJson(id, query as IQuery);
        const dataset = datasets.find((d) => d.id === id);
        let sections: ISection[] = dataset.data;

        if (q.HasFilter) {
            let filteredSections: ISection[] = [];
            for (const s of sections) {
                if (filter(s, q.Filter)) {
                    filteredSections.push(s);
                }
            }
            sections = filteredSections;
        }

        if (sections.length > 5000) {
            throw new InsightError("Too many results");
        }

        if (q.HasOrder) {
            sections = sortByKey(q.OrderString, sections);
        }

        let results = [];
        for (const s of sections) {
            results.push(buildResult(q, s));
        }
        return results;
    }
}

export function buildResult(q: ISmartQuery, s: ISection) {
    let result: any = {};
    for (const c of q.Columns) {
        if (c.Type === ColumnType.MField) {
            switch (c.Field as MField) {
                case MField.Audit: result[q.ID + "_audit"] = s.audit; break;
                case MField.Avg: result[q.ID + "_avg"] = s.avg; break;
                case MField.Fail: result[q.ID + "_fail"] = s.fail; break;
                case MField.Pass: result[q.ID + "_pass"] = s.pass; break;
                case MField.Year: result[q.ID + "_year"] = s.year; break;
            }
        } else {
            switch (c.Field as SField) {
                case SField.Dept: result[q.ID + "_dept"] = s.dept; break;
                case SField.ID: result[q.ID + "_id"] = s.id; break;
                case SField.Instructor: result[q.ID + "_instructor"] = s.instructor; break;
                case SField.Title: result[q.ID + "_title"] = s.title; break;
                case SField.UUID: result[q.ID + "_uuid"] = s.uuid; break;
            }
        }
    }
    return result;
}

export function filter(s: ISection, f: ISmartFilter): boolean {
    switch (f.Type) {
        case FilterType.LogicComparison: return filterLogicComparison(s, f.Filter as ILogicComparison);
        case FilterType.MComparison: return filterMComparison(s, f.Filter as IMComparison);
        case FilterType.SComparison: return filterSComparison(s, f.Filter as ISComparison);
        case FilterType.Negation: return filterNegation(s, f.Filter as INegation);
    }
}

export function filterNegation(s: ISection, f: INegation) {
    return !filter(s, f.Filter);
}

export function filterLogicComparison(s: ISection, f: ILogicComparison): boolean {
    switch (f.Logic) {
        case Logic.AND:
            for (const ff of f.FilterArray) {
                if (!filter(s, ff)) {
                    return false;
                }
            }
            return true;
        case Logic.OR:
            for (const ff of f.FilterArray) {
                if (filter(s, ff)) {
                    return true;
                }
            }
            return false;
    }
}

export function filterMComparison(s: ISection, f: IMComparison): boolean {
    const mfield = f.MField;
    let value;
    switch (mfield) {
        case MField.Audit: value = s.audit; break;
        case MField.Avg: value = s.avg; break;
        case MField.Fail: value = s.fail; break;
        case MField.Pass: value = s.pass; break;
        case MField.Year: value = s.year; break;
    }
    switch (f.MComparator) {
        case MComparator.EQ: return value === f.Value;
        case MComparator.GT: return value > f.Value;
        case MComparator.LT: return value < f.Value;
    }
}

export function filterSComparison(s: ISection, f: ISComparison): boolean {
    const sfield = f.SField;
    let value;
    switch (sfield) {
        case SField.Dept: value = s.dept; break;
        case SField.ID: value = s.id; break;
        case SField.Instructor: value = s.instructor; break;
        case SField.Title: value = s.title; break;
        case SField.UUID: value = s.uuid; break;
    }
    return isMatch(value, f.IDString, f.PrefixAsterisk, f.PostfixAsterisk);
}
