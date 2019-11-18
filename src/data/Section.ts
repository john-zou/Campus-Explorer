import { ISection } from "./ISection";
import { IValidSectionFromData } from "./IValidSectionFromData";

export class Section implements ISection {
    public dept: string;
    public id: string;
    public avg: number;
    public instructor: string;
    public title: string;
    public pass: number;
    public fail: number;
    public audit: number;
    public year: number;
    public uuid: string;

    private constructor() {
        //
    }

    public static fromValidSectionData(data: IValidSectionFromData, id: string): any {
        const transformedSection: any = {};
        transformedSection[id + "_dept"] = data.Subject;
        transformedSection[id + "_id"] = data.Course;
        transformedSection[id + "_avg"] = data.Avg;
        transformedSection[id + "_instructor"] = data.Professor;
        transformedSection[id + "_title"] = data.Title;
        transformedSection[id + "_pass"] = data.Pass;
        transformedSection[id + "_fail"] = data.Fail;
        transformedSection[id + "_audit"] = data.Audit;
        transformedSection[id + "_year"] = parseInt(data.Year, 10);
        transformedSection[id + "_uuid"] = data.id.toString();
        if (transformedSection[id + "_year"] === undefined) {
            transformedSection[id + "_year"] = 1900;
        }
        return transformedSection;
    }
}
