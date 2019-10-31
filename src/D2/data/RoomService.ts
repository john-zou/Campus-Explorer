import { InsightError, InsightDatasetKind } from "../../controller/IInsightFacade";
import { ActualDataset } from "../../data/ActualDataset";
import JSZip = require("jszip");
import Insight from "../../util/Insight";
import { IndexValidator } from "./IndexValidator";
import { IRoom } from "./IRoom";
import { Building } from "./Building";

/**
 * Have fun with this -John
 */
export async function roomService(id: string, files: JSZip.JSZipObject[]): Promise<ActualDataset> {
    const dataset = new ActualDataset(id, InsightDatasetKind.Rooms);
    const indexValidator = new IndexValidator();
    let index: JSZip.JSZipObject;
    for (const f of files) {
        if (f.name === "index.htm") {
            index = f;
        }
    }
    let roomsHref: Building[] = await indexValidator.validate(index);

    // To get a single file in string form:
    let fileInStringForm: string;
    try {
        fileInStringForm = await files[0].async("text");
    } catch (err) {
        // Probably just do nothing if a single file is broken
    }

    return dataset;
}
