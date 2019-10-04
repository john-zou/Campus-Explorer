import { ParsedCoursesData } from "./ParsedCoursesData";
import { KeyMap } from "../query_schema/KeyMap";
import { Section } from "./Section";
import { ISection } from "./ISection";
import JSZip = require("jszip");
import Log from "../Util";

export async function parseSectionsFromFile(file: JSZip.JSZipObject, parsedData: ParsedCoursesData): Promise<void> {
    const jsonString: string = await file.async("text");
    const json: any = JSON.parse(jsonString);
    // Check if it has exactly two keys (expecting result and rank)
    if (json == null || typeof json !== "object") {
        throw new Error("JSON.parse returned a non-object");
    }
    if (Object.keys(json).length !== 2) {
        throw new Error("Current file does not have exactly 2 keys");
    }
    // Check if it has the "result" key
    if (Object.keys(json)[0] !== "result") {
        throw new Error("Current file does not have 'result' key");
    }
    // Check if it's an array
    if (!Array.isArray(json.result)) {
        throw new Error("Result value is not an array");
    }
    // Log.trace(json.result);
    // For each item in the array, try to parse it as a section
    for (const potentialSection of json.result) {
        // Log.trace(JSON.stringify(potentialSection));
        parseSection(potentialSection, parsedData);
    }
}

export function parseSection(json: any, parsedData: ParsedCoursesData): void {
    if (isValidSection(json)) {
        const newSection: ISection = Section.fromValidSectionData(json);
        // If there is a json.Section === "overall", then set the year to 1900
        if (json.Section === "overall") {
            newSection.year = 1900;
        }
        parsedData.addSection(newSection);
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
