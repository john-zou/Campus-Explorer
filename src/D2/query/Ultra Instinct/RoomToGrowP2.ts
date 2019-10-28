import { getChildrenNodesByName } from "./UltraInstinct";

import { hasClass, getRoomNumber, getText, getHref } from "./RoomToGrow";

import JSZip = require("jszip");

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
