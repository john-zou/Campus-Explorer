import { Room } from "./Room";
const Parse5 = require("parse5");
import JSZip = require("jszip");
import { tablesearch } from "./IndexValidatorFunctions";
import { InsightError } from "../../controller/IInsightFacade";
import { IRoom } from "./IRoom";

export class IndexValidator {
    public async validate(index: JSZip.JSZipObject): Promise<Room[]> {
        const parsedDoc: Document = Parse5.parse(await index.async("text"));
        // traverse document recursively looking for a table element
        const tables: ChildNode[] = tablesearch(document);
        if (tables === null) {
            // fail
            throw new InsightError("No table found in index.htm");
        }
        // parse table instances to find rooms (should have an array of tables)
        // Follow links in table (href) to find more data about the rooms
        return []; // stub
    }

}
