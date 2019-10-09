import { IParsedData } from "./IParsedData";
import { ISection } from "./ISection";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import Log from "../Util";

export class ParsedCoursesData implements IParsedData {
    public data: ISection[] = [];
    public id: string;
    public kind: InsightDatasetKind = InsightDatasetKind.Courses;
    public numRows: number = 0;

    public constructor(id: string) {
        this.id = id;
    }

    public addSection(section: ISection): void {
        this.data.push(section);
        this.numRows++;
    }
}
