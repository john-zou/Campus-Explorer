export interface IQuery {
    WHERE: IFilter | {};
    OPTIONS: IOptions;
}

export type IFilter = IAnd|IOr|ILt|IGt|IEq|IIs|INot;
export type IOptions = IOptionsWithoutOrder | IOptionsWithOrder;

export interface IOptionsWithOrder {
    COLUMNS: string[];
    ORDER: string;
}

export interface IOptionsWithoutOrder {
    COLUMNS: string[];
}

export interface IAnd {
    AND: IFilter[];
}

export interface IOr {
    OR: IFilter[];
}

export interface INot {
    NOT: IFilter;
}

export interface ILt {
    LT: any;
}

export interface IGt {
    GT: any;
}

export interface IEq {
    EQ: any;
}

export interface IIs {
    IS: any;
}
