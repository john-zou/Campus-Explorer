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

    public static fromValidSectionData(data: IValidSectionFromData): ISection {
        const transformedSection: ISection = new Section();
        transformedSection.dept = data.Subject;
        transformedSection.id = data.Course;
        transformedSection.avg = data.Avg;
        transformedSection.instructor = data.Professor;
        transformedSection.title = data.Title;
        transformedSection.pass = data.Pass;
        transformedSection.fail = data.Fail;
        transformedSection.audit = data.Audit;
        transformedSection.year = parseInt(data.Year, 10);
        transformedSection.uuid = data.id.toString();
        // If it's not parseable to a whole number, set it to -1 (since we are treating any Year string value as valid)
        if (transformedSection.year === undefined) {
            transformedSection.year = -1;
        }
        return transformedSection;
    }
}
