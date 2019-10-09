// import { IParsedData } from "../data/IParsedData";
// import { ISection } from "../data/ISection";
// import { ISmartColumn, ColumnType, MField, SField, ISmartFilter, FilterType,
//     ILogicComparison, ISComparison, IMComparison, INegation, Logic, MComparator } from "../query_schema/ISmartQuery";

// export function whereFilter(parsedData: ISection, filter: ISmartFilter): boolean {
//     switch (filter.Type) {
//         case FilterType.LogicComparison:
//             return whereLComp(parsedData, filter.Filter as ILogicComparison);
//         case FilterType.MComparison:
//             return whereMcomp(parsedData, filter.Filter as IMComparison);
//         case FilterType.SComparison:
//             return whereScomp(parsedData, filter.Filter as ISComparison);
//         case FilterType.Negation:
//             return whereNeg(parsedData, filter.Filter as INegation);
//         default:
//             throw new Error("Invalid Smart Query");
//     }
// }

// export function whereMcomp(parsedData: ISection, mcomp: IMComparison): boolean {
//     switch (mcomp.MComparator) {
//         case MComparator.GT:
//             return (parsedData as any)[MField[mcomp.MField].toLowerCase()] > mcomp.Value;
//         case MComparator.LT:
//             return (parsedData as any)[MField[mcomp.MField].toLowerCase()] < mcomp.Value;
//         case MComparator.EQ:
//             return (parsedData as any)[MField[mcomp.MField].toLowerCase()] === mcomp.Value;
//         default:
//             break;
//     }
// }

// export function whereScomp(parsedData: ISection, scomp: ISComparison): boolean {
//     let reg: RegExp;
//     if (scomp.PrefixAsterisk && scomp.PostfixAsterisk) {
//         reg = new RegExp(scomp.IDString);
//     } else if (scomp.PrefixAsterisk) {
//         reg = new RegExp(scomp.IDString + "$");
//     } else if (scomp.PostfixAsterisk) {
//         reg = new RegExp("^" + scomp.IDString);
//     } else {
//         reg = new RegExp("^" + scomp.IDString + "$");
//     }
//     return reg.test((parsedData as any)[SField[scomp.SField].toLowerCase()]);
// }

// export function whereLComp(parsedData: ISection, lcomp: ILogicComparison): boolean {
//     let l: ISmartFilter;
//     switch (lcomp.Logic) {
//         case Logic.AND:
//             for (l of lcomp.FilterArray) {
//                 if (!whereFilter(parsedData, l)) {
//                     return false;
//                 }
//             }
//             return true;
//         case Logic.OR:
//             for (l of lcomp.FilterArray) {
//                 if (whereFilter(parsedData, l)) {
//                     return true;
//                 }
//             }
//             return false;
//         default:
//             throw new Error("Invalid Smart Query");
//     }
// }

// export function whereNeg(parsedData: ISection, neg: INegation): boolean {
//     return !whereFilter(parsedData, neg.Filter);
// }

// class ISectionMod {
//     constructor (columns: ISmartColumn[], section: ISection, id: string) {
//         let c: ISmartColumn;
//         for (c of columns) {
//             switch (c.Type) {
//                 case ColumnType.MField:
//                     (this as any)[id + "_"  + String(MField[c.Field]).toLowerCase()]
//                         = (section as any)[MField[c.Field].toLowerCase()];
//                     break;
//                 case ColumnType.SField:
//                     (this as any)[id + "_" + String(SField[c.Field]).toLowerCase()]
//                         = (section as any)[SField[c.Field].toLowerCase()];
//                     break;
//                 default:
//                     break;
//             }
//         }
//     }
// }

// export function removeColumns(columns: ISmartColumn[], data: ISection[], id: string): any[] {
//     let newData: any[] = data.map((value: ISection) => {
//         return new ISectionMod(columns, value, id);
//     });
//     return newData;
// }

// // Order dataset according to parameter in order
// export function orderData(order: ISmartColumn, s: ISection[]): ISection[] {
//     switch (order.Type) {
//         case ColumnType.MField:
//             return s.sort((a, b) => {
//                 return (a as any)[MField[order.Field].toLowerCase()] -
//                     (b as any)[MField[order.Field].toLowerCase()];
//             });
//         case ColumnType.SField:
//             return s.sort((a, b) => {
//                 return (a as any)[SField[order.Field].toLowerCase()].
//                     localeCompare((b as any)[SField[order.Field].toLowerCase()]);
//             });
//         default:
//             break;
//     }
// }
