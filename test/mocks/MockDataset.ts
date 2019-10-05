import { IParsedData } from "../../src/data/IParsedData";
import { InsightDatasetKind } from "../../src/controller/IInsightFacade";
import { ISection } from "../../src/data/ISection";

export class MockDataset implements IParsedData {
    public data: ISection[];
    public id: string;
    public kind = InsightDatasetKind.Courses;
    public get numRows(): number {
        return DataCue.length;
    }

    public constructor(id: string, data: ISection[]) {
        this.data = data;
        this.id = id;
    }
}
