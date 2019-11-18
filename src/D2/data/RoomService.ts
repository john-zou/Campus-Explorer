import { InsightError, InsightDatasetKind } from "../../controller/IInsightFacade";
import { Dataset } from "../../data/Dataset";
import JSZip = require("jszip");
import Insight from "../../util/Insight";
import { IndexValidator } from "./IndexValidator";
import { IRoom } from "./IRoom";
import { Building } from "./Building";

/**
 * Have fun with this -John
 */
export async function roomService(id: string, files: JSZip.JSZipObject[]): Promise<Dataset> {
    // D2 TODO
    // Feel free to delete this file and make your own (don't have to keep this function name either)
    // This promise is awaited in DataParser.ts (line 39) as part of addDataset.

    // I made all necessary changes in InsightFacade,
    // DataManager, DataParser, and DiskManager already
    // So you just need to do the implementation of going from
    // a list of files objects representing what's inside the rooms folder, to an ActualDataset
    // files is the files/folders inside the rooms folder (so the rooms folder for sure exists at this point)
    // you'll need to see if index.htm exists, and go from there

    const dataset = new Dataset(id, InsightDatasetKind.Rooms);

    // To get a single file in string form:
    let fileInStringForm: string;
    try {
        fileInStringForm = await files[0].async("text");
    } catch (err) {
        // Probably just do nothing if a single file is broken
    }

    return dataset;
}
