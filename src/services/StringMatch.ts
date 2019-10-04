
// export function isMatch(stringFromData: string, inputStringFromQuery: string,
//                         prefixAsterisk: boolean, postfixAsterisk: boolean): boolean {
//     // see if inputString is in field
//     if (!prefixAsterisk && !postfixAsterisk) {
//         return stringFromData === inputStringFromQuery;
//     }
//     if (!prefixAsterisk && postfixAsterisk) {
//         if (stringFromData.length < inputStringFromQuery.length) {
//             return false;
//         }
//         for (let i = 0; i < inputStringFromQuery.length; ++i) {
//             if (stringFromData[i] !== inputStringFromQuery[i]) {
//                 return false;
//             }
//         }
//         return true;
//     }
//     if (prefixAsterisk && !postfixAsterisk) {
//         if (stringFromData.length < inputStringFromQuery.length) {
//             return false;
//         }
//         for (let i = inputStringFromQuery.length - 1, j = stringFromData.length - 1; i >= 0; --i, --j) {
//             if (inputStringFromQuery[i] !== inputStringFromQuery[j]) {
//                 return false;
//             }
//         }
//         return true;
//     } else {
//         // Both prefix and postfix asterisk
//         return stringFromData.includes(inputStringFromQuery);
//     }
// }
