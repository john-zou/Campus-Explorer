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

export function validateTables(tables: ChildNode[]): ChildNode {
    for (const table of tables) {
        // stub
    }
    return null; // stub
}
