import JSZip = require("jszip");
import { Building } from "./Building";
import { IRoom } from "./IRoom";
const Parse5 = require("parse5");

export async function extractRooms(index: JSZip.JSZipObject[], buildings: Building[]): Promise<IRoom[]> {
    // Get files for each building, extract geolocation
    for (const building of buildings) {
        // Parse html
        const editedPath = "rooms" + building.href.substring(1);
        const buildinginfo: Document = findFile(index, editedPath);
        // Get GR

        // Make rooms
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
