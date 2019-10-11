import { Room } from "./Room";
const Parse5 = require("parse5");
import JSZip = require("jszip");

export class IndexValidator {
    public async validate(index: JSZip.JSZipObject): Promise<Room[]> {
        const parsedDoc = Parse5.parse(await index.async("text"));
        return []; // stub
    }
}
