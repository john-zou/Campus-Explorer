import JSZip = require("jszip");
import Log from "../../../Util";
import { MagicQueue } from "./MagicQueue";
import { getBodyFromDocument, getAttrByName, getChildrenNodesByName, getChildNodeByName } from "./UltraInstinct";
const parse5 = require("parse5");

export const getRoomsFromLink = async (link: string, id: string, files: JSZip.JSZipObject[]): Promise<any[]> => {
    const file = getFileByLink(link, files);
    if (file != null) {
        Log.trace("Wow found: " + file.name);
        const str = await file.async("text");
        return getRoomsFromHtmlStr(str, id, files);
    }
    return [];
};

export const getRoomsFromHtmlStr = (str: string, id: string, files: JSZip.JSZipObject[]): any[] => {
    const doc: Document = parse5.parse(str);
    // BFS
    const body = getBodyFromDocument(doc);
    return searchHarderForRooms(body, id);
};

const notFound: [boolean, string, string] = [false, null, null];

const getDescendentValues = (possibleAncestors: Node[], ancestors: string[]): string[] => {
    // DFS
    return [];
};

export const findFullnameAndAddress = (node: any): [boolean, string, string] => {
    if (node.nodeName !== "div" || node.attrs === undefined) {
        return notFound;
    }
    const id = getAttrByName(node, "id");
    if (id !== "building-info" || node.childNodes === undefined) {
        return notFound;
    }

    // Fullname
    let fullname = getDescendentValues(node.childNodes, ["h2", "span", "#text"]);
    if (fullname == null) {
        return notFound;
    }

    // Address
    // Assume good structure

};

export const searchHarderForRooms = (body: Node, id: string): any[] => {
    const q = new MagicQueue<Node>();
    q.enqueue(body);
    let foundFullnameAndAddress = false;
    let fullname = null;
    let address = null;
    while (q.StillHasStuff()) {
        const node = q.dequeue();
        if (!foundFullnameAndAddress) {
            const [foundIt, fullnameObtained, addressObtained] = findFullnameAndAddress(node);
            if (foundIt) {
                foundFullnameAndAddress = true;
                fullname = fullnameObtained;
                address = addressObtained;
                continue;
            }
        }
        if (node.nodeName === "tbody") {
            if (node.childNodes == null) {
                continue;
            }
            const rooms = reallyTryToGetRoomsFromTableBody(node, id);
            if (rooms.length > 0) {
                return rooms;
            }
        }
        if (node.childNodes == null) {
            continue;
        }
        for (let i = 0; i < node.childNodes.length; ++i) {
            let j = i;
            q.EnQ(node.childNodes[i]);
        }
    }
    return [];
};

export const reallyTryToGetRoomsFromTableBody = (tbody: Node, id: string): any[] => {
    const rooms = [];
    if (tbody.childNodes == null) {
        return [];
    }
    // TODO
};

export const getFileByLink = (link: string, files: JSZip.JSZipObject[]): JSZip.JSZipObject => {
    const path = toFilePathString(link);
    for (const f of files) {
        if (f.name === path) {
            return f;
        }
    }
    return null;
};

export const toFilePathString = (link: string): string => {
    let prefix = "rooms";
    let suffix = link.substring(1);
    return prefix + suffix;
};
