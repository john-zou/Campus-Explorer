import { IDataParser } from "./IDataParser";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { IParsedData } from "./IParsedData";
import JSZip = require("jszip");
import Insight from "../util/Insight";

export class DataParser implements IDataParser {
    public parseDatasetZip(id: string, content: string, kind: InsightDatasetKind): Promise<IParsedData> {
        let courses: JSZip;

        if (id === null || content === null) {
            return Insight.Error("Null arguments");
        }
        return JSZip.loadAsync(content, {base64: true}).then((zip: JSZip) => {
            courses = zip.folder("courses");
            let files: any = Object.values(courses.files);
            if (files.length === 0) {
                return Insight.Error("No files in courses folder"); // TODO: put in helper function
            }
        }).catch ((err: any) => {
            return Insight.Error(`Zip file failed to load: ${id}`);
        });
    }
}
