import { InsightDatasetKind as InsightDatasetKind, InsightError } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";
import { ParsedCoursesData } from "./ParsedCoursesData";
import { parseSectionsFromFile } from "./DataParsingFunctions";
import Log from "../Util";
import { FileParseResult, FileParseResultFlag } from "./FileParseResult";
import { Dataset } from "./Dataset";
import { ULTRAINSTINCT } from "../D2/query/Ultra Instinct/UltraInstinct";

export class DataParser {
    /**
     * @param id a valid id
     * @param content a non-null string
     * @param kind a non-null InsightDatasetKind
     */
    public async parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<Dataset> {
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
        let folder: JSZip;
        switch (kind) {
            case InsightDatasetKind.Courses:
                folder = zip.folder("courses");
                break;
            case InsightDatasetKind.Rooms:
                folder = zip.folder("rooms");
                break;
        }
        let files: JSZip.JSZipObject[] = Object.values(folder.files);
        if (files.length === 0) {
            throw new InsightError("No files in the necessary folder");
        }
        if (kind === InsightDatasetKind.Rooms) {
            return await ULTRAINSTINCT(id, files); // D2 TODO -- can change it if you want
        }
        const [dataset, summary]: [Dataset, ParseSummary] = await this.parseCoursesFiles(id, files);
        if (dataset.Elements.length === 0) {
            throw new InsightError("No valid sections");
        } else {
            Log.trace(`==================================================================================`);
            Log.trace(`| SUCCESSFULLY ADDED DATASET: ID: ${dataset.ID}, numRows: ${dataset.Elements.length}`);
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
            return dataset;
        }
    }

    private async parseCoursesFiles(id: string, files: JSZip.JSZipObject[]): Promise<[Dataset, ParseSummary]> {
        const actualDataset: Dataset = new Dataset(id, InsightDatasetKind.Courses);
        actualDataset.Elements = [];
        let summary: ParseSummary = new ParseSummary();
        let totalValidSections: number = 0;
        for (const file of files) {
            try {
                const result: FileParseResult = await parseSectionsFromFile(file, actualDataset, id);
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
        return [actualDataset, summary];
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
