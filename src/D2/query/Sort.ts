import { sortByKey } from "../../services/QP2_Helpers";

// CRITICAL SECTION
export function sort(q: any, realGs: any[]) {
    if (q.OPTIONS.ORDER === undefined) {
        return realGs;
    }
    const o = q.OPTIONS.ORDER;
    if (typeof o === "string") {
        // realG's keys for fields start with _
        if (o.includes("_")) {
            return sortByKey("_" + o.split("_")[1], realGs);
        } else {
            return sortByKey(o, realGs);
        }
    }
    return complicatedSort(o, realGs);
}

/**
 * Returns custom comparator function based on keys and direction
 * @param key keyString of the property to compare
 */
const complicatedComparer: (keys: string[], up: boolean) => (a: any, b: any) => number =
    (keys, up) => {
        return (a, b) => {
            for (const k of keys) {
                let key = k;
                if (key.includes("_")) {
                    key = "_" + key.split("_")[1];
                }
                if (a[key] > b[key]) {
                    return up ? 1 : -1;
                }
                if (a[key] < b[key]) {
                    return up ? -1 : 1;
                }
            }
            return 0;
        };
    };

export function complicatedSort(o: any, realGs: any[]) {
    return realGs.sort(complicatedComparer(o.keys, o.dir === "UP"));
}
