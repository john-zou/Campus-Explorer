import { sortByKey } from "../../services/QP2_Helpers";
import { complicatedSort, sort } from "./Sort";

export function transform(q: any, objects: any[]): any[] {
    const groups = makeGroups(q, objects);
    const realGs = apply(q, groups);
    const sortedGs = sort(true, q, realGs);
    const realestGs = formatResult(q, sortedGs);
    return realestGs;
}

function makeGroups(q: any, objects: any[]) {
    const g = q.TRANSFORM.GROUP;
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
        for (const ggg of groups) {
            // keys loop
            for (const gg of g) {
                // Check to make sures keys are the same as first thing in the group
                if (ggg[0][gg] !== thing[gg.split("_")[1]]) {
                    continue groupsloop;
                }
            }
            ggg.push(thing);
            continue objectsloop;
        }
        // Make a new group
        groups.push([thing]);
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
    const groupkeys: string[]  = query.TRANSFORM.GROUP;
    const applyrules: any[] = query.TRANSFORM.APPLY;
    const groupObjects: any[] = [];
    for (const group of groups) {
        const groupObject: any = {};
        for (const groupkey of groupkeys) {
            // Adding _ to distinguish from applyKeys. Later, we check for _
            // to see if it's a key or an applykey
            groupObject["_" + groupkey.split("_")[1]] = group[0][groupkey];
        }
        for (const applyrule of applyrules) {
            const applyKey: string = Object.keys(applyrule)[0]; // applyKey e.g. "imESLintIMSOCOOL"
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
                    groupObject[applyKey] = sum(group, field) / group.length;
                    break;
                case "SUM":
                    groupObject[applyKey] = sum(group, field);
                    break;
                case "COUNT":
                    groupObject[applyKey] = group.length;
                    break;
            }
        }
        groupObjects.push(groupObject);
    }
    return groupObjects;
}

function min(g: any[], key: string) {
    let minn = g[0][key];
    for (const lasagna of g) {
        minn = lasagna[key] > minn ? minn : lasagna[key];
    }
    return minn;
}

function max(g: any[], key: string) {
    let maxx = g[0][key];
    for (const lasagna of g) {
        maxx = lasagna[key] > maxx ? lasagna[key] : max;
    }
    return maxx;
}

function sum(g: any[], key: string) {
    let summ = 0;
    for (const lasagna of g) {
        summ += lasagna[key];
    }
    return summ;
}
