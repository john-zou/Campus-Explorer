import { sortByKey } from "../../services/QP2_Helpers";

export function sort(transformed: boolean, q: any, realGs: any[]) {
    if (q.OPTIONS.ORDER === undefined) {
        return realGs;
    }
    const o = q.OPTIONS.ORDER;
    if (typeof o === "string") { // simple sort
        if (transformed) {
            // group's keys for fields start with _
            if (o.includes("_")) {
                return sortByKey("_" + o.split("_")[1], realGs);
            } else {
                return sortByKey(o, realGs);
            }
        } else {
            return sortByKey(o.split("_")[1], realGs);
        }
    }
    return complicatedSort(transformed, o, realGs);
}

/**
 * Returns custom comparator function based on keys and direction
 * @param key keyString of the property to compare
 */
const complicatedComparer: (transformed: boolean, keys: string[], up: boolean) => (a: any, b: any) => number =
    (transformed, keys, up) => {
        return (a, b) => {
            for (const k of keys) {
                let key = k;
                if (transformed) {
                    if (key.includes("_")) {
                        key = "_" + key.split("_")[1];
                    }
                } else {
                    key = key.split("_")[1];
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

export function complicatedSort(transformed: boolean, o: any, realGs: any[]) {
    return realGs.sort(complicatedComparer(transformed, o.keys, o.dir === "UP"));
}
