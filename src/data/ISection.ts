export interface ISection {
    setUuid(uuid: string): void;

    dept: string; // cpsc
    id: string; // 310
    avg: number;
    instructor: string;
    title: string; // Softeng
    pass: number;
    fail: number;
    audit: number;
    year: number;
    uuid: string; // Must be a string, not a number
}
