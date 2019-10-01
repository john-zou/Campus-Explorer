import { ParsedCoursesData } from "./ParsedCoursesData";
import { KeyMap } from "../query_schema/KeyMap";
import { Section } from "./Section";
import { isDeepStrictEqual } from "util";
import { ISection } from "./ISection";

export function parseSectionsFromFile(file: any, parsedData: ParsedCoursesData): void {
    // Check if it's an array
    if (!Array.isArray(file)) {
        return;
    }
    // For each item in the array, try to parse it as a section
    for (const item in file) {
        parseSectionFromFile(item, parsedData);
    }
}

export function parseSectionFromFile(json: any, parsedData: ParsedCoursesData): void {
    if (isValidSection(json)) {
        const newSection: ISection = Section.fromValidSectionData(json);
        parsedData.addSection(newSection);
    }
}

export function isValidSection(json: any): boolean {
    // Check if it's an object
    if (json == null || typeof json !== "object") {
        return false;
    }
    // Check for the presence of all necessary keys:
    const keysInJson: string[] = Object.keys(json);
    const requiredKeys: string[] = Object.values(KeyMap);
    for (const key in requiredKeys) {
        if (!keysInJson.includes(key)) {
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
        && isStringAndCanBeParsedToInt(year);
}

export function isString(x: any): boolean {
    return x != null && typeof x === "string";
}

export function isNumber(x: any): boolean {
    return x != null && typeof x === "number";
}

export function isStringAndCanBeParsedToInt(x: any): boolean {
    return isString(x) && parseInt(x, 10) !== undefined;
}
