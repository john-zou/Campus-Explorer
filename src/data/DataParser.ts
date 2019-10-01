import { IDataParser } from "./IDataParser";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";
import { ParsedCoursesData } from "./ParsedCoursesData";
import { parseSectionsFromFile } from "./DataParsingFunctions";

export class DataParser implements IDataParser {
    public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
        if (id === null || content === null) {
            return Insight.Error("Null arguments");
        }
        try {
            const zip: JSZip = await JSZip.loadAsync(content, { base64: true });
            const courses: JSZip = zip.folder("courses");
            let files: JSZip.JSZipObject[] = Object.values(courses.files);
            if (files.length === 0) {
                return Insight.Error("No files in courses folder");
            }
            const parsedData: IParsedData = await this.parseFiles(id, files);
            if (parsedData.numRows === 0) {
                return Insight.Error("No valid sections");
            } else {
                return parsedData;
            }
        } catch (err) {
            return Insight.Error(`Zip file failed to load: ${id}`);
        }
    }

    private async parseFiles(id: string, files: JSZip.JSZipObject[]): Promise<IParsedData> {
        const parsedData: ParsedCoursesData = new ParsedCoursesData(id);
        for (const file of files) {
            try { await parseSectionsFromFile(file, parsedData);
            } catch (err) { // from JSON parsing
                continue;
            }
        }
        return parsedData;
    }
}
