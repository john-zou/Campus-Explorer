import { complicatedSort, sort } from "./Sort";

export function dontTransform(q: any, things: any[]): any[] {
    const sortedThings = sort(q, things);
    return makeNewThings(q, sortedThings);
}

function makeNewThings(q: any, things: any[]) {
    const columns: string[] = q.OPTIONS.COLUMNS;
    const newThings = [];
    for (const oldThing of things) {
        const newThing: any = {};
        for (const c of columns) {
            const key = c.split("_")[1];
            newThing[c] = oldThing[key]; // e.g. Section { avg: 100 } to new thing { courses_avg: 100 }
        }
        newThings.push(newThing);
    }
    return newThings;
}
