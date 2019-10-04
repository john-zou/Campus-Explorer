import { IParsedData } from "../data/IParsedData";

export function whereFilter(parsedData: any, filter: any): boolean {
    // Case breakdown - written in nested ifs for clarity
    // Logic comparison
    let mode: string = Object.keys(filter)[0];
    if (this.LOGIC.includes(mode)) {
        if (mode === "OR") {
            return this.whereFilter(parsedData, filter.OR[0]) || this.whereFilter(parsedData, filter.OR[1]);
        }
        if (mode === "AND") {
            return this.whereFilter(parsedData, filter.OR[0]) && this.whereFilter(parsedData, filter.OR[1]);
        }
    }
    // MComparison
    if (this.MCOMPARISON.includes(mode)) {
        return this.whereMcomp(parsedData, filter[mode]);
    }
    // SComparison
    if (this.SCOMPARISON.includes(mode)) {
        return this.whereScomp(parsedData, filter[mode]);
    }
}
export function whereMcomp(parsedData: any, mcomp: string): boolean {
    return true; // stub
}

export function whereScomp(parsedData: any, scomp: string): boolean {
    return true; // stub
}

// Order dataset according to parameter in order
export function orderData(order: any, dataset: IParsedData): Promise <IParsedData> {
    dataset.data = dataset.data.sort((a: any, b: any) => {
        // with a little help from https://mzl.la/2ospbkN
        return a.order - b.order;
    });
    return Promise.resolve(dataset);
}
