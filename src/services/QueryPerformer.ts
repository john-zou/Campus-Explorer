import { IQueryPerformer } from "./IQueryPerformer";

export class QueryPerformer implements IQueryPerformer {
    public performQuery(query: any): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

}
