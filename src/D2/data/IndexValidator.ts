import { Room } from "./Room";
const Parse5 = require("parse5");
import JSZip = require("jszip");
import { tablesearch } from "./IndexValidatorFunctions";
import { InsightError } from "../../controller/IInsightFacade";

export class IndexValidator {
    public async validate(index: JSZip.JSZipObject): Promise<Room[]> {
        const parsedDoc: Document = Parse5.parse(await index.async("text"));
        // traverse document recursively looking for a table element
        const table: Document = tablesearch(document);
        if (table === null) {
            // fail
            throw new InsightError("No table in index.htm");
        }
        return []; // stub
    }

}
