import JSZip = require("jszip");
import Log from "../../../Util";
import { MagicQueue } from "./MagicQueue";
import { getBodyFromDocument, getAttrByName, getChildrenNodesByName, getChildNodeByName } from "./UltraInstinct";
const parse5 = require("parse5");

export const getRoomsFromLink = async (link: string, files: JSZip.JSZipObject[]): Promise<any[]> => {
    const file = getFileByLink(link, files);
    if (file != null) {
        Log.trace("Wow found: " + file.name);
        const str = await file.async("text");
        return getRoomsFromHtmlStr(str, files);
    }
    return [];
};

export const getRoomsFromHtmlStr = (str: string, files: JSZip.JSZipObject[]): any[] => {
    const doc: Document = parse5.parse(str);
    const body = getBodyFromDocument(doc);
    return searchHarderForRooms(body);
};

const notFound: [boolean, string, string] = [false, null, null];

const getDescendentValues = (nodes: Node[], lineage: string[], level = 0): string[] => {
    const result: string[] = [];
    // Base case: get the value of everything that matches the only item left in lineage
    if (lineage.length === level + 1) {
        const descendents = getChildrenNodesByName(nodes, lineage[level]);
        for (const descendent of descendents) {
            if (descendent.value != null && typeof descendent.value === "string") {
                result.push(descendent.value);
            }
        }
        return result;
    }

    // General case, recurse down the tree with the lineage list shortening as depth increases
    const ancestors = getChildrenNodesByName(nodes, lineage[level]);

    for (const ancestor of ancestors) {
        const values = getDescendentValues(ancestor.childNodes, lineage, level + 1);
        for (const value of values) {
            result.push(value);
        }
    }
    return result;
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
    if (fullname.length === 0) {
        return notFound;
    }

    // Address
    // TODO

};

export const makeRooms = (fullname: string, address: string, rooms: any[]): any[] => {
    return [];
};

export const searchHarderForRooms = (body: Node): any[] => {
    const q = new MagicQueue<Node>();
    q.enqueue(body);
    let foundFullnameAndAddress = false;
    let foundRooms = false;
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
            const rooms = reallyTryToGetRoomsFromTableBody(node);
            if (rooms.length > 0) {
                foundRooms = true;
                if (foundFullnameAndAddress) {
                    return makeRooms(fullname, address, rooms);
                } else {
                    continue;
                }
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

export const reallyTryToGetRoomsFromTableBody = (tbody: Node): any[] => {
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
