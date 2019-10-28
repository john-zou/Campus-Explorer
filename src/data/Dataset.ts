import { InsightDatasetKind, InsightDataset } from "../controller/IInsightFacade";
import { Section } from "./Section";
import { Room } from "../D2/data/Room";

/**
 * Represents the parsed contents of one zip file (either Courses or Rooms)
 */
export class Dataset {
    public ID: string;
    public Kind: InsightDatasetKind;
    public Elements: any[] = [];

    public constructor(id: string, kind: InsightDatasetKind) {
        this.ID = id;
        this.Kind = kind;
    }

    public static toInsightDataset(dataset: Dataset): InsightDataset {
        return {
            id: dataset.ID,
            kind: dataset.Kind,
            numRows: dataset.Elements.length,
        };
    }
}
