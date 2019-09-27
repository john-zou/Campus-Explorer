export interface IQueryPerformer {
    performQuery(query: any): Promise<any[]>;
}
