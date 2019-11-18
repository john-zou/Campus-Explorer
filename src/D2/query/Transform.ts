import { sortByKey } from "../../services/QP2_Helpers";
import { complicatedSort, sort } from "./Sort";
import { ResultTooLargeError } from "../../controller/IInsightFacade";

const Decimal = require("decimal.js");

export function transform(q: any, objects: any[]): any[] {
    const groups = makeGroups(q, objects);
    const groupObjects = apply(q, groups);
    const sortedGroupObjects = sort(true, q, groupObjects);
    const formattedResults = formatResult(q, sortedGroupObjects);
    return formattedResults;
}

function makeGroups(q: any, objects: any[]) {
    const groupKeys = q.TRANSFORMATIONS.GROUP;
    const groups: any[][] = [];

    // tl;dr either join a group or make a new one
    if (q === undefined || q === null) {
        throw new Error("q should not be null or undefined");
    }

    if (objects === undefined || objects === null) {
        throw new Error("t should not be null or undefined");
    }

    objectsloop:
    for (const thing of objects) {
        groupsloop:
        for (const group of groups) {
            // keys loop
            for (const groupKey of groupKeys) {
                // Check to make sures keys are the same as first thing in the group
                if (group[0][groupKey.split("_")[1]] !== thing[groupKey.split("_")[1]]) {
                    continue groupsloop;
                }
            }
            group.push(thing);
            continue objectsloop;
        }
        // Make a new group
        groups.push([thing]);
        if (groups.length > 5000) {
            throw new ResultTooLargeError("Over 5000 groups");
        }
    }
    return groups;
}

export function formatResult(q: any, groups: any[]) {
    const cols: string[] = q.OPTIONS.COLUMNS;

    const formattedResults: any[] = [];
    for (const group of groups) {
        const formattedResult: any = {};
        for (const c of cols) {
            if (c.includes("_")) {
                const groupKey = "_" + c.split("_")[1];
                formattedResult[c] = group[groupKey];
            } else {
                formattedResult[c] = group[c];
            }
        }
        formattedResults.push(formattedResult);
    }
    return formattedResults;
}

/**
 * the transform apply stuff
 */
function apply(query: any, groups: any[]) {
    const groupkeys: string[]  = query.TRANSFORMATIONS.GROUP;
    const applyrules: any[] = query.TRANSFORMATIONS.APPLY;
    const groupObjects: any[] = [];
    for (const group of groups) {
        const groupObject: any = {};
        for (const groupkey of groupkeys) {
            // Adding _ to distinguish from applyKeys. Later, we check for _
            // to see if it's a key or an applykey
            groupObject["_" + groupkey.split("_")[1]] = group[0][groupkey.split("_")[1]];
        }
        for (const applyrule of applyrules) {
            const applyKey: string = Object.keys(applyrule)[0]; // applyKey e.g. "sumLat"
            const av: any = Object.values(applyrule)[0]; // abstract object
            const applyToken: string = Object.keys(av)[0]; // MAX / MIN / AVG / SUM / COUNT
            const field = (Object.values(av)[0] as string).split("_")[1]; // field e.g. avg, year, lon, lat
            switch (applyToken) {
                case "MAX":
                    groupObject[applyKey] = max(group, field);
                    break;
                case "MIN":
                    groupObject[applyKey] = min(group, field);
                    break;
                case "AVG":
                    groupObject[applyKey] = ave(group, field);
                    break;
                case "SUM":
                    const summ = sum(group, field);
                    groupObject[applyKey] = Number(summ.toFixed(2));
                    break;
                case "COUNT":
                    groupObject[applyKey] = count(group, field);
                    break;
            }
        }
        groupObjects.push(groupObject);
    }
    return groupObjects;
}

function ave(groupMembers: any[], field: string) {
    let total = new Decimal(0);
    for (const member of groupMembers) {
        const num = new Decimal(member[field]);
        total = Decimal.add(num, total);
    }
    const avg = total.toNumber() / groupMembers.length;
    return Number(avg.toFixed(2));
}

function min(groupMembers: any[], field: string) {
    let minn = groupMembers[0][field];
    for (const member of groupMembers) {
        if (member[field] < minn) {
            minn = member[field];
        }
    }
    return minn;
}

function max(groupMembers: any[], field: string) {
    let maxx = groupMembers[0][field];
    for (const member of groupMembers) {
        if (member[field] > maxx) {
            maxx = member[field];
        }
    }
    return maxx;
}

function sum(groupMembers: any[], key: string) {
    let summ = 0;
    for (const member of groupMembers) {
        summ += member[key];
    }
    return summ;
}

function count(groupMembers: any[], key: string) {
    let uniques: any[] = [];
    for ( const member of groupMembers) {
        if (!uniques.includes(member[key])) {
            uniques.push(member[key]);
        }
    }
    return uniques.length;
}
