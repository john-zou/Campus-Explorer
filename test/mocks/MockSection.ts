import { ISection } from "../../src/data/ISection";

export class MockSection implements ISection {
    public setUuid(uuid: string): void {
        throw new Error("Method not implemented.");
    }
    public dept: string = "mock";
    public id: string = "mock";
    public avg: number = -1;
    public instructor: string = "mock";
    public title: string = "mock";
    public pass: number = -1;
    public fail: number = -1;
    public audit: number = -1;
    public year: number = -1;
    public uuid: string = "mock";

    /**
     * Returns an ISection[] of uuid from [0..n-1] (toString())
     * @param n amount
     */
    public static getMockSections(n: number): ISection[] {
        let sections: ISection[] = [];
        for (let i = 0; i < n; ++i) {
            const section = new MockSection();
            section.uuid = i.toString();
            sections.push(section);
        }
        return sections;
    }
}
