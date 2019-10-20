import JSZip = require("jszip");
import Log from "../../../Util";
import { MagicQueue } from "./MagicQueue";
import { getBodyFromDocument, getAttrByName } from "./UltraInstinct";
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

export const searchHarderForRooms = (body: Node, id: string): any[] => {
    const q = new MagicQueue<Node>();
    q.EnQ(body);
    while (q.StillHasStuff()) {
        const n = q.DQ();
        if (n.nodeName === "div") {
            if (n.childNodes == null) {
                continue;
            }
            const rooms = tryToGetRoomsFromDiv(n, id);
            if (rooms.length > 0) {
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
    return [];
};

export const tryToGetRoomsFromDiv = (div: Node, datasetId: string): any[] => {
    // See if it has attr id
    const id = getAttrByName(div, "id");
    if (id == null) {
        return [];
    }
    if (id.includes("room-data")) {
        return [];
    }
    if (id !== "room-data") {
        return [];
    }
    return [];
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
