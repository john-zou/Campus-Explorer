import { ISmartFilter, ILogicComparison, FilterType,
     Logic, IMComparison, ISComparison, MComparator,
      MField, SField, INegation, ISmartColumn, ColumnType, Column } from "./ISmartQuery";

export class SmartColumn implements ISmartColumn {
    public Type: ColumnType;
    public Field: Column;
}

export class SmartFilterLogicComparison implements ISmartFilter {
    public Type: FilterType = FilterType.LogicComparison;
    public Filter: ILogicComparison;
}

export class LogicComparison implements ILogicComparison {
    public Logic: Logic;
    public FilterArray: ISmartFilter[];
}

export class SmartFilterMComparison implements ISmartFilter {
    public Type: FilterType = FilterType.MComparison;
    public Filter: IMComparison;
}

export class SmartFilterSComparison implements ISmartFilter {
    public Type: FilterType = FilterType.SComparison;
    public Filter: ISComparison;
}

export class MComparison implements IMComparison {
    public MComparator: MComparator;
    public MField: MField;
    public Value: number;
}

export class SComparison implements ISComparison {
    public SField: SField;
    public IDString: string;
    public PrefixAsterisk: boolean;
    public PostfixAsterisk: boolean;
}

export class SmartFilterNegation implements ISmartFilter {
    public Type: FilterType = FilterType.Negation;
    public Filter: INegation;
}

export class Negation implements INegation {
    public Filter: ISmartFilter;
}
