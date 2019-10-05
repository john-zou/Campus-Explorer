export enum FileParseResultFlag {
    MissingResultKey,
    HasResultKeyButIsNotArray,
    HasResultArray,
}

export class FileParseResult {
    public Flag: FileParseResultFlag;
    public InvalidSections: number = 0;
    public ValidSections: number = 0;
}

export enum SectionParseResult {
    Valid,
    Invalid
}
