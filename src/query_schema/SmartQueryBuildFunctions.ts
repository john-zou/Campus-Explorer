import { ISmartFilter, Logic, MComparator, FilterType,
    ILogicComparison, IMComparison, fieldFromString, MField, ISComparison, SField, INegation } from "./ISmartQuery";
import { IFilter, IAnd, IOr, IGt, ILt, IEq, IIs, INot } from "./IQuery";

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
    let s: ISmartFilter;
    s.Type = FilterType.LogicComparison;
    let f: ILogicComparison;
    f.Logic = logic;
    f.FilterArray = [];
    for (const filter of filters) {
        f.FilterArray.push(buildSmartFilter(filter));
    }
    s.Filter = f;
    return s;
}

export function buildMComparison(mComparator: MComparator, mcomparison: any): ISmartFilter {
    let s: ISmartFilter;
    s.Type = FilterType.MComparison;
    let f: IMComparison;
    f.MComparator = mComparator;
    f.MField = getField(mcomparison) as MField;
    f.Value = getMValue(mcomparison);
    s.Filter = f;
    return s;
}

export function buildSComparison(scomparison: any): ISmartFilter {
    let s: ISmartFilter;
    s.Type = FilterType.SComparison;
    let f: ISComparison;
    f.SField = getField(scomparison) as SField;
    [f.IDString, f.PostfixAsterisk, f.PostfixAsterisk] = getIdstring(scomparison);
    s.Filter = f;
    return s;
}

export function buildNegation(filter: any): ISmartFilter {
    let s: ISmartFilter;
    s.Type = FilterType.Negation;
    let f: INegation;
    f.Filter = buildSmartFilter(filter);
    s.Filter = f;
    return s;
}

export function getField(comparison: any) {
    const key = Object.keys(comparison)[0];
    return fieldFromString(key.split("_")[1]);
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
