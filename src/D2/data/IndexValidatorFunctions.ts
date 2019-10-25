import { IRoom } from "./IRoom";
import { NotFoundError, InsightError } from "../../controller/IInsightFacade";

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
    for (let table of tables) {
        // Extract some useful fields from the table
        let thead: ChildNode;
        let trthead: ChildNode;
        let tbody: ChildNode;
        try {
            thead = findNode(table.childNodes, "thead");
            trthead = findNode(thead.childNodes, "tr");
            tbody = findNode(table.childNodes, "tbody");
        } catch (error) {
            continue;
        }
        // Find the relevant index for href
        const hrefind: number = findNodeWithAttr(trthead.childNodes, "views-field views-field-title");
        let hrefchildren: NodeListOf<ChildNode> = trthead.childNodes[hrefind].childNodes;
        // const href: string = findNode(hrefchildren, "a").attrs[0].value;

    }
    return null; // stub
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
export function findNodeWithAttr (nodes: NodeListOf<ChildNode>, attr: string): number {
    const len: number = nodes.length;
    for (let i = 0; i < len; i++) {
        if (!nodes[i].hasOwnProperty("attrs")) {
            continue;
        }
        // if (nodes[i].attrs[0].value === attr) {
        //     return i;
        // }
    }
    return -1;
}
