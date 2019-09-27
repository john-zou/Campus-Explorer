import { InsightDatasetKind } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";

export interface IDataParser {
    parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData>;
}
