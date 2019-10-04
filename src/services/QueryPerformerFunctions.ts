import { IParsedData } from "../data/IParsedData";
import { ISection } from "../data/ISection";
import { ISmartColumn, ColumnType, MField, SField, ISmartFilter, FilterType,
    ILogicComparison, ISComparison, IMComparison, INegation, Logic, MComparator } from "../query_schema/ISmartQuery";

export function whereFilter(parsedData: ISection, filter: ISmartFilter): boolean {
    switch (filter.Type) {
        case FilterType.LogicComparison:
            return whereLComp(parsedData, filter.Filter as ILogicComparison);
            break;
        case FilterType.MComparison:
            return whereMcomp(parsedData, filter.Filter as IMComparison);
            break;
        case FilterType.SComparison:
            return whereScomp(parsedData, filter.Filter as ISComparison);
            break;
        case FilterType.Negation:
            return whereNeg(parsedData, filter.Filter as INegation);
            break;
        default:
            throw new Error("Invalid Smart Query");
    }
}

export function whereMcomp(parsedData: ISection, mcomp: IMComparison): boolean {
    switch (mcomp.MComparator) {
        case MComparator.GT:
            return (parsedData as any)[mcomp.MField] > mcomp.Value;
            break;
        case MComparator.LT:
            return (parsedData as any)[mcomp.MField] < mcomp.Value;
            break;
        case MComparator.EQ:
            return (parsedData as any)[mcomp.MField] === mcomp.Value;
            break;
        default:
            break;
    }
}

export function whereScomp(parsedData: ISection, scomp: ISComparison): boolean {
    return true; // stub
}

export function whereLComp(parsedData: ISection, lcomp: ILogicComparison): boolean {
    let l: ISmartFilter;
    switch (lcomp.Logic) {
        case Logic.AND:
            for (l of lcomp.FilterArray) {
                if (!whereFilter(parsedData, l)) {
                    return false;
                }
            }
            return true;
            break;
        case Logic.OR:
            for (l of lcomp.FilterArray) {
                if (whereFilter(parsedData, l)) {
                    return true;
                }
            }
            return false;
            break;
        default:
            throw new Error("Invalid Smart Query");
    }
}

export function whereNeg(parsedData: ISection, neg: INegation): boolean {
    return !whereFilter(parsedData, neg.Filter);
}

class ISectionMod {
    constructor (columns: ISmartColumn[], section: ISection) {
        let c: ISmartColumn;
        for (c of columns) {
            switch (c.Type) {
                case ColumnType.MField:
                    (this as any)[MField[c.Field]] = (section as any)[MField[c.Field]];
                    break;
                case ColumnType.SField:
                    (this as any)[SField[c.Field]] = (section as any)[SField[c.Field]];
                    break;
                default:
                    break;
            }
        }
    }
}

export function removeColumns(columns: ISmartColumn[], data: ISection[]): any[] {
    let newData: any[] = data.map((value: ISection) => {
        return new ISectionMod(columns, value);
    });
    return newData;
}

// Order dataset according to parameter in order
export function orderData(order: ISmartColumn, s: ISection[]): ISection[] {
    switch (order.Type) {
        case ColumnType.MField:
            return s.sort((a, b) => {
                return (a as any)[MField[order.Field].toLowerCase()] -
                    (b as any)[MField[order.Field].toLowerCase()];
            });
        case ColumnType.SField:
            return s.sort((a, b) => {
                return (a as any)[SField[order.Field].toLowerCase()].
                    localeCompare((b as any)[SField[order.Field].toLowerCase()]);
            });
        default:
            break;
    }
}
