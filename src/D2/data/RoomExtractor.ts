import JSZip = require("jszip");
import { Building } from "./Building";
import { IRoom } from "./IRoom";
import { tablesearch } from "./IndexValidatorFunctions";
const Parse5 = require("parse5");

export async function extractRooms(index: JSZip.JSZipObject[], buildings: Building[]): Promise<IRoom[]> {
    // Get files for each building, extract geolocation
    for (const building of buildings) {
        // Parse html
        const editedPath = "rooms" + building.href.substring(1);
        const buildinginfo: Document = findFile(index, editedPath);
        // Make rooms
        // Get tables in file
        const tables: ChildNode[] = tablesearch(buildinginfo);
        for (const table of tables) {
            let thead: ChildNode;
            let inumber: number;
            let icapacity: number;
            let ifurniture: number;
            let itype: number;
            let tbody: ChildNode;
            // try {

            // } catch (error) {
            //     continue;
            // }
        }
    }
    // using files, extract rooms
    return null; // stub
}

export function findFile(index: JSZip.JSZipObject[],  path: string): Document {
    for (const file of index) {
        if (file.name === path) {
            return Parse5.parse(file.async("text").toString());
        }
    }
}
