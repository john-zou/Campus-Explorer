
/**
 * Improved version of IQuery
 */
export interface ISmartQuery {
    ID: string;
    Filter?: ISmartFilter;
    HasFilter: boolean;
    Columns: ISmartColumn[];
    Order?: ISmartColumn;
    HasOrder: boolean;
}

export enum MComparator {
    GT, LT, EQ
}
export interface ISmartColumn {
    Type: ColumnType;
    Field: Column;
}

export enum ColumnType {
    MField, SField
}

export type Column = MField | SField;

export enum FilterType {
    LogicComparison, MComparison, SComparison, Negation
}

export enum Logic {
    AND, OR
}

export enum MField {
    Avg, Pass, Fail, Audit, Year,
}

export enum SField {
    Dept, ID, Instructor, Title, UUID
}

export function mFieldFromString(s: string): MField {
    switch (s) {
        case "avg": return MField.Avg;
        case "pass": return MField.Pass;
        case "fail": return MField.Fail;
        case "audit": return MField.Audit;
        case "year": return MField.Year;
    }
}

export function sFieldFromString(s: string): SField {
    switch (s) {
        case "dept": return SField.Dept;
        case "id": return SField.ID;
        case "instructor": return SField.Instructor;
        case "title": return SField.Title;
        case "uuid": return SField.UUID;
    }
}

export interface IMComparison {
    MComparator: MComparator;
    MField: MField;
    Value: number;
}

export interface ISComparison {
    SField: SField;
    IDString: string;
    PrefixAsterisk: boolean;
    PostfixAsterisk: boolean;
}

export interface ILogicComparison {
    Logic: Logic;
    FilterArray: ISmartFilter[];
}

export interface INegation {
    Filter: ISmartFilter;
}

export interface ISmartFilter {
    Type: FilterType;
    Filter: ILogicComparison | IMComparison | ISComparison | INegation;
}
