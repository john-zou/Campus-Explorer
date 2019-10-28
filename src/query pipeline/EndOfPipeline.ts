
export const endOfPipeline = (query: any, elements: any[]): any[] => {
    const order = query.OPTIONS.ORDER;
    let sortedElements: any[];
    if (order) {
        sortedElements = sort(query, elements);
    } else {
        sortedElements = elements;
    }
    const columns: string[] = query.OPTIONS.COLUMNS;
    const results: any[] = [];
    for (const element of sortedElements) {
        const result: any = {};
        for (const c of columns) {
            result[c] = element[c];
        }
        results.push(result);
    }

    return results;
};

export function sort(q: any, elements: any[]) {
    const order = q.OPTIONS.ORDER;
    if (typeof order === "string") { // simple sort
            // group's keys for fields start with _
         return singleSort(order, elements);
    }
    return multiSort(order, elements);
}

/**
 * Returns custom comparator function based on keys and direction
 * @param key keyString of the property to compare
 */
const multiComparer: (keys: string[], up: boolean) => (a: any, b: any) => number =
    (keys, up) => {
        return (a, b) => {
            for (const key of keys) {
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

export function multiSort(o: any, groups: any[]) {
    return groups.sort(multiComparer(o.keys, o.dir === "UP"));
}

const singleComparer: (key: string) => (a: any, b: any) => number =
    (key) => {
        return (a, b) => {
            if (a[key] < b[key]) {
                return -1;
            }
            if (a[key] > b[key]) {
                return 1;
            } else {
                return 0;
            }
        };
    };

export function singleSort(key: string, arr: any[]): any[] {
    return arr.sort(singleComparer(key));
}
