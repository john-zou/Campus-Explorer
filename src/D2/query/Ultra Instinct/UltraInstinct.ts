import JSZip = require("jszip");
import { ActualDataset } from "../../../data/ActualDataset";
import { InsightError, InsightDatasetKind } from "../../../controller/IInsightFacade";
import Log from "../../../Util";
import { MagicQueue } from "./MagicQueue";
import { getRoomsFromLink } from "./RoomToGrow";
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
    const str = await index.async("text");
    const document = parse5.parse(str);
    const body = getBodyFromDocument(document);
    return searchForRooms(body, id, files);
}

export function getBodyFromDocument(document: Document) {
    const nodes = document.childNodes;
    const htmlNode = getChildNodeByName(nodes, "html");
    if (htmlNode == null) {
        throw new InsightError("No HTML tag in index.htm");
    }
    return getChildNodeByName(htmlNode.childNodes, "body");
}

/**
 * @returns the subset of nodes with the correct name
 * @param nodes the children nodes to search in (these ARE the children)
 * @param str the nodeName to check
 */
export const getChildrenNodesByName = (nodes: any, str: string): any[] => {
    if (nodes == null) {
        return [];
    }
    let children: any[] = [];
    for (let i = 0; i < nodes.length; ++i) {
        let j = i;
        if (nodes[i].nodeName === str) {
            children.push(nodes[i]);
        }
    }
    return children;
};

/**
 * @param nodes IMPORTANT: childNodes
 * @param str nodeName to match
 */
export function getChildNodeByName(nodes: any, str: string) {
    if (nodes == null) {
        return null;
    }
    for (let i = 0; i < nodes.length; ++i) {
        let j = i;
        if (nodes[i].nodeName === str) {
            return nodes[i];
        }
    }
    return null;
}

export const searchForRooms =
    async (htmlBody: Node, id: string, files: JSZip.JSZipObject[]): Promise<ActualDataset> => {
    // BFS
    const q = new MagicQueue<Node>();
    q.EnQ(htmlBody);
    while (q.StillHasStuff()) {
        const n = q.DQ();
        if (n.nodeName === "tbody") {
            if (n.childNodes == null) {
                continue;
            }
            const rooms = await tryToGetRoomsFromTableBody(n, id, files);
            if (rooms.Rooms.length > 0) {
                return rooms;
            }
        }
        if (n.childNodes == null) {
            continue;
        }
        for (let i = 0; i < n.childNodes.length; ++i) {
            let j = i;
            q.EnQ(n.childNodes[i]);
        }
    }
    throw new InsightError("No valid rooms!");
};

export const tryToGetRoomsFromTableBody =
    async (tbody: any, id: string, files: JSZip.JSZipObject[]): Promise<ActualDataset> => {
    const actualDataset = new ActualDataset(id, InsightDatasetKind.Rooms);
    if (tbody.childNodes == null) {
        return actualDataset; // let the caller deal with it
    }
    for (let i = 0; i < tbody.childNodes.length; ++i) {
        let j = i;
        const tr = tbody.childNodes[i];
        const visited: any[] = [];
        if (tbody.childNodes[i].nodeName === "tr") {
            const rooms = await getRoomsFromTableRow(tr, id, files, visited);
            for (const r of rooms) {
                actualDataset.Rooms.push(r);
            }
        }
    }
    return actualDataset;
};

export const getRoomsFromTableRow =
    async (tr: Node, id: string, files: JSZip.JSZipObject[], visited: any[]): Promise<any[]> => {

    const ret: any[] = [];
    if (tr.childNodes == null) {
        return ret;
    }
    for (let i = 0; i < tr.childNodes.length; ++i) {
        let ii = i;
        const c = tr.childNodes[i];
        if (c.nodeName === "td" && c.childNodes != null) {
            const link: string = getAddressFromTd(c);
            if (link != null && !visited.includes(link)) {
                visited.push(link);
                const roomsFromLink = await getRoomsFromLink(link, files);
                for (const r of roomsFromLink) {
                    ret.push(r);
                }
            }
        }
    }
    return ret;
};

export const getAddressFromTd = (td: Node): string => {
    if (td.childNodes == null) {
        return null;
    }
    for (let i = 0; i < td.childNodes.length; ++i) {
        let j = i;
        if (td.childNodes[i].nodeName === "a") {
            const str = getAttrByName(td.childNodes[i], "href");
            if (str != null) {
                return str;
            }
        }
    }
    return null;
};

export const getAttrByName = (n: any, str: string): string => {
    if (n.attrs == null) {
        return null;
    }
    for (let i = 0; i < n.attrs.length; ++i) {
        let j = i;
        if (n.attrs[i].name === str) {
            return n.attrs[i].value as string;
        }
    }
    return null;
};
