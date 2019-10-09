import { InsightDatasetKind, InsightDataset } from "../controller/IInsightFacade";
import { Section } from "./Section";
import { Room } from "../D2/data/Room";

/**
 * Represents the parsed contents of one zip file (either Courses or Rooms)
 */
export class ActualDataset {
    public ID: string;
    public Kind: InsightDatasetKind;
    public Sections?: Section[];
    public Rooms?: Room[];

    public constructor(id: string, kind: InsightDatasetKind) {
        this.ID = id;
        this.Kind = kind;
        switch (kind) {
            case InsightDatasetKind.Courses: this.Sections = [];
            case InsightDatasetKind.Rooms: this.Rooms = [];
        }
    }

    public toInsightDataset(): InsightDataset {
        let numRows: number;
        switch (this.Kind) {
            case InsightDatasetKind.Courses:
                numRows = this.Sections.length;
            case InsightDatasetKind.Rooms:
                numRows = this.Rooms.length;
        }
        return {
            id: this.ID,
            kind: this.Kind,
            numRows: numRows
        };
    }
}
