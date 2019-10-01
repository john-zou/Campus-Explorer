import { IDataParser } from "./IDataParser";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";
import { ParsedCoursesData } from "./ParsedCoursesData";
import { parseSectionsFromFile } from "./DataParsingFunctions";

export class DataParser implements IDataParser {
    public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
        let courses: JSZip;
        if (id === null || content === null) {
            return Insight.Error("Null arguments");
        }
        try {
            const zip: JSZip = await JSZip.loadAsync(content, { base64: true });
            courses = zip.folder("courses");
            let files: any[] = Object.values(courses.files);
            if (files.length === 0) {
                return Insight.Error("No files in courses folder");
            }
            const parsedData: IParsedData = this.parseFiles(id, files);
            if (parsedData.numRows === 0) {
                return Insight.Error("No valid sections");
            } else {
                return parsedData;
            }
        } catch (err) {
            return Insight.Error(`Zip file failed to load: ${id}`);
        }
    }

    private parseFiles(id: string, files: any[]): IParsedData {
        const parsedData: ParsedCoursesData = new ParsedCoursesData(id);
        for (const file in files) {
            parseSectionsFromFile(file, parsedData);
        }
        return parsedData;
    }
}
