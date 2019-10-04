import { ParsedCoursesData } from "./ParsedCoursesData";
import { KeyMap } from "../query_schema/KeyMap";
import { Section } from "./Section";
import { ISection } from "./ISection";
import JSZip = require("jszip");
import Log from "../Util";
import { FileParseResult, FileParseResultFlag, SectionParseResult } from "./FileParseResult";

export async function parseSectionsFromFile(file: JSZip.JSZipObject,
                                            parsedData: ParsedCoursesData):
                                            Promise<FileParseResult> {
    const jsonString: string = await file.async("text");
    const json: any = JSON.parse(jsonString);
    // if (Object.keys(json).length !== 2) {
    //     throw new Error("Current file does not have exactly 2 keys");
    // }
    // Check if it has the "result" key
    let fileParseResult = new FileParseResult();
    if (!Object.keys(json).includes("result")) {
        fileParseResult.Flag = FileParseResultFlag.MissingResultKey;
        return fileParseResult;
    }
    // Check if it's an array
    if (!Array.isArray(json.result)) {
        fileParseResult.Flag = FileParseResultFlag.HasResultKeyButIsNotArray;
        throw new Error("Result value is not an array");
    }
    fileParseResult.Flag = FileParseResultFlag.HasResultArray;
    // Log.trace(json.result);
    // For each item in the array, try to parse it as a section
    for (const potentialSection of json.result) {
        // Log.trace(JSON.stringify(potentialSection));
        let sectionResult: SectionParseResult = parseSection(potentialSection, parsedData);
        switch (sectionResult) {
            case SectionParseResult.Valid:
                ++fileParseResult.ValidSections;
                break;
            case SectionParseResult.Invalid:
                ++fileParseResult.InvalidSections;
                break;
        }
    }
    return fileParseResult;
}

export function parseSection(json: any, parsedData: ParsedCoursesData): SectionParseResult {
    if (isValidSection(json)) {
        const newSection: ISection = Section.fromValidSectionData(json);
        // If there is a json.Section === "overall", then set the year to 1900
        if (json.Section === "overall") {
            newSection.year = 1900;
        }
        parsedData.addSection(newSection);
        return SectionParseResult.Valid;
    } else {
        return SectionParseResult.Invalid;
    }
}

export function isValidSection(json: any): boolean {
    // Check if it's an object
    if (json == null || typeof json !== "object") {
        // Log.trace("Not an object");
        return false;
    }
    // Check for the presence of all necessary keys:
    const keysInJson: string[] = Object.keys(json);
    // Log.trace(keysInJson.toString());
    const requiredKeys: string[] = Object.values(KeyMap);
    for (const key of requiredKeys) {
        if (!keysInJson.includes(key)) {
            // Log.trace(`Missing a key: ${key}`);
            return false;
        }
    }
    // Check the value of all the necessary keys:
    const dept: any = json.Subject;
    const id: any = json.Course;
    const avg: any = json.Avg;
    const instructor: any = json.Professor;
    const title: any = json.Title;
    const pass: any = json.Pass;
    const fail: any = json.Fail;
    const audit: any = json.Audit;
    const year: any = json.Year;
    return isString(dept) && isString(id) && isNumber(avg) && isString(instructor)
        && isString(title) && isNumber(pass) && isNumber (fail) && isNumber(audit)
        && isString(year);
}

export function isString(x: any): boolean {
    return x != null && typeof x === "string";
}

export function isNumber(x: any): boolean {
    return x != null && typeof x === "number";
}

// Unused
// export function isStringAndCanBeParsedToInt(x: any): boolean {
//     return isString(x) && parseInt(x, 10) !== undefined;
// }
