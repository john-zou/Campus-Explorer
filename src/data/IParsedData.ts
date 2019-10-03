import { InsightDataset } from "../controller/IInsightFacade";
import { ISection } from "./ISection";

export interface IParsedData extends InsightDataset {
    data: ISection[];
}
