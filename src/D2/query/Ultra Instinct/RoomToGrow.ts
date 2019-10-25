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
    const divs = getChildrenNodesByName(node.childNodes, "div");
    const addr = getAddressFromDivs(divs);
    if (addr == null) {
        return notFound;
    }

    return [true, fullname[0], addr];
};

export const getAddressFromDivs = (divs: any[]): string => {
    const buildingFields = divs.filter((node) => hasClass(node, "building-field"));
    if (buildingFields.length < 1) {
        return null;
    }
    // Take the index = 0 one
    const theOneWithTheAddress = buildingFields[0];
    const fieldContentChild = getChildNodeByName(theOneWithTheAddress.childNodes, "div");
    if (fieldContentChild == null) {
        return null;
    }
    if (hasClass(fieldContentChild, "field-content")) {
        // Check the text child
        const textChild = getChildNodeByName(fieldContentChild.childNodes, "#text");
        if (textChild == null) {
            return null;
        } else {
            return textChild.value;
        }
    } else {
        return null;
    }
};

export const hasClass = (node: any, classy: string): boolean => {
    if (node.attrs == null) {
        return false;
    }
    for (const attr of node.attrs) {
        if (attr.name === "class" && attr.value === classy) {
            return true;
        }
    }
    return false;
};

export const makeRooms = (fullname: string, address: string, rooms: any[]): any[] => {
    const result = [];
    for (const room of rooms) {
        result.push ({
            // TODO
        });
    }
    return result;
};

export const searchHarderForRooms = (body: Node): any[] => {
    let foundFullnameAndAddress = false;
    let foundRooms = false;
    let fullname = null;
    let address = null;

    // BFS
    const q = new MagicQueue<Node>();
    q.enqueue(body);
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
            q.enqueue(node.childNodes[i]);
        }
    }
    return [];
};

export const reallyTryToGetRoomsFromTableBody = (tbody: Node): any[] => {
    const rooms = [];
    if (tbody.childNodes == null) {
        return [];
    }
    const tableRows = getChildrenNodesByName(tbody.childNodes, "tr");
    //
    for (const tr of tableRows) {
        const room = getRoomFromTableRow(tr);
        if (room != null) {
            rooms.push(room);
        }
    }
    return rooms;
};

export const getText = (node: any): string => {
    if (node.childNodes == null) {
        return null;
    }
    const text = getChildNodeByName(node.childNodes, "#text");
    if (text == null) {
        return null;
    }
    return text.value;
};

export const getRoomNumber = (td: any): string => {
    return getDescendentValues(td.childNodes, ["a", "#text"])[0];
};

export const getHref = (td: any): string => {
    const a = getChildNodeByName(td.childNodes, "a");
    if (a == null) {
        return null;
    }
    if (a.attrs == null) {
        return null;
    }
    for (const attr of a.attrs) {
        if (attr.name === "href") {
            return attr.value;
        }
    }
    return null;
};

export const getRoomFromTableRow = (tr: Node): any => {
    const tds = getChildrenNodesByName(tr.childNodes, "td");
    let foundRoomNumber = false;
    let foundSeats = false;
    let foundType = false;
    let foundFurniture = false;
    let foundHref = false;
    const room: any = {};
    for (const td of tds) {
        if (hasClass(td, "views-field views-field-field-room-number")) {
            const numbery = getRoomNumber(td);
            if (numbery != null) {
                room.number = numbery;
                foundRoomNumber = true;
            }
        } else if (hasClass(td, "views-field views-field-field-room-capacity")) {
            const seats = getText(td).trim();
            if (seats != null) {
                const seatsInt = parseInt(seats, 10);
                if (seatsInt != null) {
                    room.seats = seatsInt;
                    foundSeats = true;
                }
            }
        } else if (hasClass(td, "views-field views-field-field-room-type")) {
            const typey = getText(td).trim();
            if (typey != null) {
                room.type = typey;
                foundType = true;
            }
        } else if (hasClass(td, "views-field views-field-field-room-furniture")) {
            const furn = getText(td).trim();
            if (furn != null) {
                room.furniture = furn;
                foundFurniture = true;
            }
        } else if (hasClass(td, "views-field views-field-nothing")) {
            const href = getHref(td);
            if (href != null) {
                room.href = href;
                foundHref = true;
            }
        }
    }
    if (foundRoomNumber && foundSeats && foundType && foundFurniture && foundHref) {
        return room;
    }
    return null;
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
