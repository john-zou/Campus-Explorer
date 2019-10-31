import { IRoom } from "./IRoom";
import { NotFoundError, InsightError } from "../../controller/IInsightFacade";
import { Room } from "./Room";
import JSZip = require("jszip");
const fs = require("fs");
const Parse5 = require("parse5");

// May be a good idea to do some actual parsing on the table
export function tablesearch(doc: Document): ChildNode[] {
    let tables: ChildNode[] = [];
    tables = tablesearchrec(doc.childNodes);
    if (tables === []) {
        throw new InsightError("No tables found");
    }
    return tables;
}

function tablesearchrec(cnodes: NodeListOf<ChildNode>): ChildNode[] {
    if (cnodes === null || cnodes === undefined) {
        return [];
    }
    let found: ChildNode[] = [];
    const len: number = cnodes.length;
    for (let i = 0; i < len; i++) {
        if (cnodes[i].nodeName === "table") {
            found.push(cnodes[i]);
        } else {
            found = found.concat(tablesearchrec(cnodes[i].childNodes));
        }
    }
    return found;
}

// Attempts to add all HREF elements to new room objects, moves on to next table if there is a failure
export function constructRooms(tables: ChildNode[]): IRoom[] {
    let rooms: IRoom[] = [];
    for (const table of tables) {
        // Extract some useful fields from the table
        let thead: ChildNode;
        let trthead: ChildNode;
        let tbody: ChildNode;
        let hrefind: number;
        try {
            thead = findNode(table.childNodes, "thead");
            trthead = findNode(thead.childNodes, "tr");
            tbody = findNode(table.childNodes, "tbody");
            hrefind = findNodeWithAttr(trthead.childNodes, "views-field views-field-title");
        } catch (error) {
            continue;
        }
        // Find all hrefs
        const len: number = tbody.childNodes.length;
        for (let i = 0; i < len; i++) {
            if (tbody.childNodes[i].nodeName !== "tr") {
                continue;
            }
            const hrefnode = tbody.childNodes[i].childNodes[hrefind];
            const href: string = (findNode(hrefnode.childNodes, "a") as any).attrs[0].value;
            let room: Room = new Room();
            room.href = href;
            rooms.push(room);
        }
    }
    return rooms;
}

// Given a file path, returns a Parse5 parsedDocument
export function getParsedFile(path: string): Document {
    const htmlstring = (fs.readFileSync(path)).toString();
    const parsedDoc = Parse5.parse(htmlstring);
    return parsedDoc;
}

// Find first instance of Node with a given name in a NodeListOf<ChildNode>
export function findNode(nodes: NodeListOf<ChildNode>, name: string): ChildNode {
    const len: number = nodes.length;
    for (let i = 0; i < len; i++) {
        if (nodes[i].nodeName === name) {
            return nodes[i];
        }
    }
    throw new Error("Node not found");
}

// Returns node index with specfied attribute, returns -1 on none
export function findNodeWithAttr(nodes: NodeListOf<ChildNode>, attr: string): number {
    const len: number = nodes.length;
    for (let i = 0; i < len; i++) {
        if (!nodes[i].hasOwnProperty("attrs")) {
            continue;
        }
        if ((nodes[i] as any).attrs[0].value === attr) {
            return i;
        }
    }
    return -1;
}
