import { IParsedData } from "./IParsedData";
import { ISection } from "./ISection";
import { InsightDatasetKind } from "../controller/IInsightFacade";

export class ParsedCoursesData implements IParsedData {
    private mdata: ISection[] = [];
    public get data(): ISection[] { return this.mdata; }
    private mid: string;
    public get id(): string { return this.mid; }
    public get kind(): InsightDatasetKind { return InsightDatasetKind.Courses; }
    public get numRows(): number { return this.data.length; }

    public constructor(id: string) {
        this.mid = id;
    }

    public addSection(section: ISection): void {
        section.setUuid(this.mdata.length.toString());
        this.mdata.push(section);
    }
}
