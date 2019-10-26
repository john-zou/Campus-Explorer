import { sortByKey } from "../../services/QP2_Helpers";

export function sort(transformed: boolean, q: any, thingsToSort: any[]) {
    if (q.OPTIONS.ORDER === undefined) {
        return thingsToSort;
    }
    const order = q.OPTIONS.ORDER;
    if (typeof order === "string") { // simple sort
        if (transformed) {
            // group's keys for fields start with _
            if (order.includes("_")) {
                return sortByKey("_" + order.split("_")[1], thingsToSort);
            } else {
                return sortByKey(order, thingsToSort);
            }
        } else {
            return sortByKey(order.split("_")[1], thingsToSort);
        }
    }
    return complicatedSort(transformed, order, thingsToSort);
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
                    if (up) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                if (a[key] < b[key]) {
                    if (up) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                // Else compare by next key
            }
            return 0;
        };
    };

export function complicatedSort(transformed: boolean, o: any, groups: any[]) {
    return groups.sort(complicatedComparer(transformed, o.keys, o.dir === "UP"));
}
