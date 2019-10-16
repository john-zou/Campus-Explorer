import JSZip = require("jszip");
import { ActualDataset } from "../../../data/ActualDataset";
import { InsightError, InsightDatasetKind } from "../../../controller/IInsightFacade";
import Log from "../../../Util";
const parse5 = require("parse5");

export async function ULTRAINSTINCT(id: string, files: JSZip.JSZipObject[]): Promise<ActualDataset> {
    let index = null; // index.htm
    for (const f of files) {
        if (f.name === "rooms/index.htm") {
            index = f;
            break;
        }
    }
    if (index == null) {
        throw new InsightError("There is no index.htm!");
    }
    // try to parse5
    const indexStr = await index.async("text");
    const document: Document = parse5.parse(indexStr);

    return new ActualDataset(id, InsightDatasetKind.Rooms);
}

export function searchForTable(node: Node): Node {
    if (node == null) {
        return null;
    }
    if (isTable(node)) {
        return node;
    }
    let n = null;
    if (node.childNodes == null) {
        return null;
    }
    let len = node.childNodes.length;
    for (let i = 0; i < len; ++i) {
        n = searchForTable(node.childNodes[i]);
        if (n != null) {
            return n;
        }
    }
    return null;
}

export function isTable(node: Node): boolean {
    if (node.nodeName === "table") {
        Log.trace("ULTRA INSTINCT: Table found!");
        return true;
    }
    return false;
}
