
export function isMatch(stringFromData: string, inputStringFromQuery: string,
                        prefixAsterisk: boolean, postfixAsterisk: boolean): boolean {
    // see if inputString is in field
    if (!prefixAsterisk && !postfixAsterisk) {
        return stringFromData === inputStringFromQuery;
    }
    if (!prefixAsterisk && postfixAsterisk) {
        if (stringFromData.length < inputStringFromQuery.length) {
            return false;
        }
        for (let i = 0; i < inputStringFromQuery.length; ++i) {
            if (stringFromData[i] !== inputStringFromQuery[i]) {
                return false;
            }
        }
        return true;
    }
    if (prefixAsterisk && !postfixAsterisk) {
        if (stringFromData.length < inputStringFromQuery.length) {
            return false;
        }
        for (let i = inputStringFromQuery.length - 1, j = stringFromData.length - 1; i >= 0; --i, --j) {
            if (inputStringFromQuery[i] !== stringFromData[j]) {
                return false;
            }
        }
        return true;
    } else {
        // Both prefix and postfix asterisk
        return stringFromData.includes(inputStringFromQuery);
    }
}
/**
 * Returns custom comparator function based on key
 * @param key keyString of the property to compare
 */
const compareByKey: (key: string) => (a: any, b: any) => number =
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

export function sortByKey(key: string, arr: any[]): any[] {
    return arr.sort(compareByKey(key));
}
