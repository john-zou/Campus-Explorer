export interface IQuery {
    WHERE: IAnd|IOr|ILt|IGt|IEq|IIs|INot;
    OPTIONS: IOptionsWithoutOrder | IOptionsWithOrder;
}

export interface IOptionsWithOrder {
    COLUMNS: string[];
    ORDER: string;
}

export interface IOptionsWithoutOrder {
    COLUMNS: string[];
}

export interface IAnd {
    AND: Array<IAnd|IOr|ILt|IGt|IEq|IIs|INot>;
}

export interface IOr {
    OR: Array<IAnd|IOr|ILt|IGt|IEq|IIs|INot>;
}

export interface INot {
    NOT: IAnd|IOr|ILt|IGt|IEq|IIs|INot;
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
