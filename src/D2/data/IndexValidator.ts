import { Room } from "./Room";
const Parse5 = require("parse5");
import JSZip = require("jszip");
import { tablesearch } from "./IndexValidatorFunctions";
import { InsightError } from "../../controller/IInsightFacade";

export class IndexValidator {
    public async validate(index: JSZip.JSZipObject): Promise<Room[]> {
        const parsedDoc: Document = Parse5.parse(await index.async("text"));
        // traverse document recursively looking for a table element
        const tables: Document[] = tablesearch(document);
        if (tables === null) {
            // fail
            throw new InsightError("No table found in index.htm");
        }
        // parse table to find rooms
        return []; // stub
    }

}
