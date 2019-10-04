import { IDataParser } from "./IDataParser";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";
import { ParsedCoursesData } from "./ParsedCoursesData";
import { parseSectionsFromFile } from "./DataParsingFunctions";
import Log from "../Util";

export class DataParser implements IDataParser {
    public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
        if (id === null || content === null) {
            throw new InsightError("Null arguments");
        }
        let zip: JSZip;
        try {
            zip = await JSZip.loadAsync(content, { base64: true });
        } catch (err) {
            throw new InsightError(`Zip file failed to load: ${id}`);
        }
        const courses: JSZip = zip.folder("courses");
        let files: JSZip.JSZipObject[] = Object.values(courses.files);
        if (files.length === 0) {
            throw new InsightError("No files in courses folder");
        }
        let parsedData: IParsedData;
        parsedData = await this.parseFiles(id, files);
        if (parsedData.numRows === 0) {
            throw new InsightError("No valid sections");
        } else {
            Log.trace(`==================================================================================`);
            Log.trace(`| SUCCESSFULLY ADDED DATASET: ID: ${parsedData.id}, numRows: ${parsedData.numRows}`);
            Log.trace(`---------------------------------------------------------------------------------`);
            Log.trace(`| Total files in courses folder: ${files.length}`);
            // Log.trace(`| JSON files with result array: ${}`);
            // Log.trace(`| JSON files with result key but wrong value type: ${}`);
            // Log.trace(`| JSON files lacking result key: ${}`);
            // Log.trace(`| Non-JSON files in courses folder: ${}`);
            // Log.trace(`| Total invalid sections: ${}`);
            // Log.trace(`| Average items (any type) per result array: ${}`);
            // Log.trace(`| Average objects per result array: ${}`);
            // Log.trace(`| Average valid sections per result array: ${}`);
            // Log.trace(`==================================================================================`);
            return parsedData;
        }
    }

    private async parseFiles(id: string, files: JSZip.JSZipObject[]): Promise<IParsedData> {
        const parsedData: ParsedCoursesData = new ParsedCoursesData(id);
        for (const file of files) {
            try {
                await parseSectionsFromFile(file, parsedData);
            } catch (err) { // from JSON parsing
                // Log.trace(err);
                continue;
            }
        }
        return parsedData;
    }
}
