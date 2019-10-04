import { ISmartFilter, Logic, MComparator, FilterType,
    ILogicComparison, IMComparison, MField, ISComparison,
    SField, INegation, Column, mFieldFromString, sFieldFromString, ISmartColumn, ColumnType } from "./ISmartQuery";
import { IFilter, IAnd, IOr, IGt, ILt, IEq, IIs, INot } from "./IQuery";
import { validateColumnString } from "../services/QueryValidationFunctions_Options";
import { mfields } from "./MFields";
import { sfields } from "./SFields";
import { LogicComparison, SmartFilterLogicComparison,
    SmartFilterMComparison, MComparison, SmartFilterSComparison, SComparison,
    SmartFilterNegation, Negation, SmartColumn } from "./SmartClasses";

export function buildSmartFilter(f: IFilter): ISmartFilter {
    const key = Object.keys(f)[0];
    switch (key) {
        case "AND": return buildLogicComparison(Logic.AND, (f as IAnd).AND);
        case "OR": return buildLogicComparison(Logic.OR, (f as IOr).OR);
        case "GT": return buildMComparison(MComparator.GT, (f as IGt).GT);
        case "LT": return buildMComparison(MComparator.LT, (f as ILt).LT);
        case "EQ": return buildMComparison(MComparator.EQ, (f as IEq).EQ);
        case "IS": return buildSComparison((f as IIs).IS);
        case "NOT": return buildNegation((f as INot).NOT);
    }
}

export function buildLogicComparison(logic: Logic, filters: IFilter[]): ISmartFilter {
    let s: ISmartFilter = new SmartFilterLogicComparison();
    let f: ILogicComparison = new LogicComparison();
    f.Logic = logic;
    f.FilterArray = [];
    for (const filter of filters) {
        f.FilterArray.push(buildSmartFilter(filter));
    }
    s.Filter = f;
    return s;
}

export function buildMComparison(mComparator: MComparator, mcomparison: any): ISmartFilter {
    let s: ISmartFilter = new SmartFilterMComparison();
    let f: IMComparison = new MComparison();
    f.MComparator = mComparator;
    f.MField = getMField(mcomparison) as MField;
    f.Value = getMValue(mcomparison);
    s.Filter = f;
    return s;
}

export function buildSComparison(scomparison: any): ISmartFilter {
    let s: ISmartFilter = new SmartFilterSComparison();
    let f: ISComparison = new SComparison();
    f.SField = getSField(scomparison) as SField;
    [f.IDString, f.PrefixAsterisk, f.PostfixAsterisk] = getIdstring(scomparison);
    s.Filter = f;
    return s;
}

export function buildNegation(filter: any): ISmartFilter {
    let s: ISmartFilter = new SmartFilterNegation();
    let f: INegation = new Negation();
    f.Filter = buildSmartFilter(filter);
    s.Filter = f;
    return s;
}

export function getMField(mcomparison: any): MField {
    const key = Object.keys(mcomparison)[0];
    return mFieldFromString(key.split("_")[1]);
}

export function getSField(scomparison: any): SField {
    const key = Object.keys(scomparison)[0];
    return sFieldFromString(key.split("_")[1]);
}

export function getMValue(mcomparison: any): number {
    return Object.values(mcomparison)[0] as number;
}

export function getIdstring(scomparison: any): [string, boolean, boolean] {
    let svalue: string = Object.values(scomparison)[0] as string;
    if (svalue.length === 0) {
        return [svalue, false, false];
    }
    let hasPrefixAsterisk: boolean = svalue[0] === "*";
    let hasPostfixAsterisk: boolean = svalue[svalue.length - 1] === "*";
    if (!hasPrefixAsterisk && !hasPostfixAsterisk) {
        return [svalue, false, false];
    }
    if (hasPrefixAsterisk && !hasPostfixAsterisk) {
        return [svalue.slice(1), true, false];
    }
    if (!hasPrefixAsterisk && hasPostfixAsterisk) {
        return [svalue.slice(0, svalue.length - 1), false, true];
    }
    // has asterisk on both sides
    if (svalue.length < 3) {
        return ["", true, true];
    } else {
        return [svalue.slice(1, svalue.length - 1), true, true];
    }
}

export function getColumn(col: string): ISmartColumn {
    let smartColumn: ISmartColumn = new SmartColumn();
    const fieldStr: string = col.split("_")[1];
    if (mfields.includes(fieldStr)) {
        smartColumn.Type = ColumnType.MField;
        smartColumn.Field = mFieldFromString(fieldStr);
        return smartColumn;
    }
    if (sfields.includes(fieldStr)) {
        smartColumn.Type = ColumnType.SField;
        smartColumn.Field = sFieldFromString(fieldStr);
        return smartColumn;
    }
    throw new Error("Invalid field encountered while building SmartQuery");
}

export function getColumns(cols: string[]): ISmartColumn[] {
    let columns: ISmartColumn[] = [];
    for (const c of cols) {
        columns.push(getColumn(c));
    }
    return columns;
}
