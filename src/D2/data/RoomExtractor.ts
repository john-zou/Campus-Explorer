import JSZip = require("jszip");
import { Building } from "./Building";
import { IRoom } from "./IRoom";
import { tablesearch, findNode, findNodeWithAttr } from "./IndexValidatorFunctions";
import { Room } from "./Room";
const Parse5 = require("parse5");

export async function extractRooms(index: JSZip.JSZipObject[], buildings: Building[]): Promise<IRoom[]> {
    let rooms: IRoom[];
    // Get files for each building, extract geolocation
    for (const building of buildings) {
        // Parse html
        const editedPath = "rooms" + building.href.substring(1);
        const buildinginfo: Document = await findFile(index, editedPath);
        // Make rooms
        // Get tables in file
        const tables: ChildNode[] = tablesearch(buildinginfo);
        for (const table of tables) {
            let thead: ChildNode;
            let tbody: ChildNode;
            let trthead: ChildNode;
            let inumber: number;
            let icapacity: number;
            let ifurniture: number;
            let itype: number;
            try {
                thead = findNode(table.childNodes, "thead");
                tbody = findNode(table.childNodes, "tbody");
                trthead = findNode(thead.childNodes, "tr");
                inumber = findNodeWithAttr(trthead.childNodes, "views-field views-field-field-room-number");
                icapacity = findNodeWithAttr(trthead.childNodes, "views-field views-field-field-room-capacity");
                ifurniture = findNodeWithAttr(trthead.childNodes, "views-field views-field-field-room-furniture");
                itype = findNodeWithAttr(trthead.childNodes, "views-field views-field-field-room-type");
            } catch (error) {
                // If any fields are missing, skip
                continue;
            }
            // Add all rooms
            const len: number = tbody.childNodes.length;
            for (let i = 0; i < len; i++) {
                if (tbody.childNodes[i].nodeName !== "tr") {
                    continue;
                }
                // Initialize based on building
                let room: Room = new Room(building);
                room.number = (tbody.childNodes[i].childNodes[inumber].childNodes[0] as any).value;
                room.furniture = (tbody.childNodes[i].childNodes[ifurniture].childNodes[0] as any).value;
                room.seats = (tbody.childNodes[i].childNodes[icapacity].childNodes[0] as any).value;
                room.type = (tbody.childNodes[i].childNodes[itype].childNodes[0] as any).value;
                rooms.push(room);
            }
        }
    }
    return rooms;
}

export function findFile(index: JSZip.JSZipObject[],  path: string): Promise<Document> {
    for (const file of index) {
        if (file.name === path) {
            return Parse5.parse(file.async("text").toString());
        }
    }
}
