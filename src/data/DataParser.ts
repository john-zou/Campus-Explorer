import { IDataParser } from "./IDataParser";
import { InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";
import { ParsedCoursesData } from "./ParsedCoursesData";
import { parseSectionsFromFile } from "./DataParsingFunctions";
import Log from "../Util";
import { FileParseResult, FileParseResultFlag } from "./FileParseResult";

export class DataParser implements IDataParser {

    /**
     * @param id a valid id
     * @param content a non-null string
     * @param kind a non-null InsightDatasetKind
     */
    public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
        // Unreacheable code
        // if (id === null || content === null) {
        //     throw new InsightError("Null arguments");
        // }
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
        const [parsedData, summary]: [IParsedData, ParseSummary] = await this.parseFiles(id, files);
        if (parsedData.numRows === 0) {
            throw new InsightError("No valid sections");
        } else {
            Log.trace(`==================================================================================`);
            Log.trace(`| SUCCESSFULLY ADDED DATASET: ID: ${parsedData.id}, numRows: ${parsedData.numRows}`);
            Log.trace(`---------------------------------------------------------------------------------`);
            Log.trace(`| Total files in courses folder: ${files.length}`);
            Log.trace(`| JSON files with result array: ${summary.JsonFilesWithResultArray}`);
            Log.trace(`| JSON files with result key but wrong value type: ${summary.JsonFilesWithResultButNotArray}`);
            Log.trace(`| JSON files lacking result key: ${summary.JsonFilesWithoutResultKey}`);
            Log.trace(`| Non-JSON files in courses folder: ${summary.BadJsonFiles}`);
            Log.trace(`| Total invalid sections: ${summary.TotalInvalidSections}`);
            Log.trace(`| Average items (any type) per result array: ${summary.AverageAnyPerArray}`);
            Log.trace(`| Average valid sections per result array: ${summary.AverageValidSectionsPerArray}`);
            Log.trace(`==================================================================================`);
            return parsedData;
        }
    }

    private async parseFiles(id: string, files: JSZip.JSZipObject[]): Promise<[IParsedData, ParseSummary]> {
        const parsedData: ParsedCoursesData = new ParsedCoursesData(id);
        let summary: ParseSummary = new ParseSummary();
        let totalValidSections: number = 0;
        for (const file of files) {
            try {
                const result: FileParseResult = await parseSectionsFromFile(file, parsedData);
                switch (result.Flag) {
                    case FileParseResultFlag.HasResultArray:
                        totalValidSections += result.ValidSections;
                        summary.TotalInvalidSections += result.InvalidSections;
                        ++summary.JsonFilesWithResultArray;
                        break;
                    case FileParseResultFlag.MissingResultKey:
                        ++summary.JsonFilesWithoutResultKey;
                        break;
                    case FileParseResultFlag.HasResultKeyButIsNotArray:
                        ++summary.JsonFilesWithResultButNotArray;
                        break;
                }
            } catch (err) { // from JSON parsing
                ++summary.BadJsonFiles;
                continue;
            }
            summary.AverageAnyPerArray =
                (totalValidSections + summary.TotalInvalidSections) / summary.JsonFilesWithResultArray;
            summary.AverageValidSectionsPerArray = totalValidSections / summary.JsonFilesWithResultArray;
        }
        return [parsedData, summary];
    }
}

class ParseSummary {
    public BadJsonFiles: number = 0;
    public JsonFilesWithResultArray: number = 0;
    public JsonFilesWithoutResultKey: number = 0;
    public JsonFilesWithResultButNotArray: number = 0;
    public TotalInvalidSections: number = 0;
    public AverageAnyPerArray: number = 0;
    public AverageValidSectionsPerArray: number = 0;
}
