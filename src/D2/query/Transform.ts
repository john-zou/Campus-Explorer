import { sortByKey } from "../../services/QP2_Helpers";
import { complicatedSort, sort } from "./Sort";

export function transform(q: any, t: any[]): any[] {
    const groups = group(q, t);
    const realGs = apply(q, groups);
    const sortedGs = sort(q, realGs);
    const realestGs = change(q, sortedGs);
    return realestGs;
}

function group(q: any, t: any[]) {
    const g = q.TRANSFORM.GROUP;
    const groups: any[][] = [];

    // tl;dr either join a group or make a new one

    hi_es_lint:
    for (const thing of t) {
        how_you_like_my_snake_case_labels:
        for (const ggg of groups) {
            for (const gg of g) {
                if (ggg[0][gg] !== thing[gg]) {
                    continue how_you_like_my_snake_case_labels;
                }
            }
            ggg.push(thing);
            continue hi_es_lint;
        }
        groups.push([thing]);
    }

    return groups;
}

function change(q: any, realGs: any[]) {
    const cols: string[] = q.OPTIONS.COLUMNS;

    const realestGs: any[] = [];
    for (const realG of realGs) {
        const realestG: any = {};
        for (const c of cols) {
            if (c.includes("_")) {
                const realGKey = "_" + c.split("_")[1];
                realestG[c] = realG[realGKey];
            } else {
                realestG[c] = realG[c];
            }
        }
        realestGs.push(realestG);
    }
    return realestGs;
}

/**
 * the transform apply stuff
 */
function apply(q: any, groups: any[]) {
    const g = q.TRANSFORM.GROUP;
    const a = q.TRANSFORM.APPLY;
    const realGs: any[] = [];
    for (const ggg of groups) {
        const realGsMoveInSilenceLikeLasagna: any = {};
        for (const gg of g) {
            realGsMoveInSilenceLikeLasagna["_" + gg] = ggg[0][gg]; // aadded _ to prevent collision with applykey
        }
        for (const aa of a) {
            const ak = Object.keys(aa)[0]; // applyKey e.g. "imESLintIMSOCOOL"
            const av = Object.values(aa)[0]; // abstract object
            const avk = Object.keys(av)[0]; // MAX / MIN / AVG / SUM / COUNT
            const avv = Object.values(av)[0].split("_")[1]; // field e.g. avg, year, lon, lat
            switch (avk) {
                case "MAX":
                    realGsMoveInSilenceLikeLasagna[ak] = max(ggg, avv);
                    break;
                case "MIN":
                    realGsMoveInSilenceLikeLasagna[ak] = min(ggg, avv);
                    break;
                case "AVG":
                    realGsMoveInSilenceLikeLasagna[ak] = sum(ggg, avv) / ggg.length;
                    break;
                case "SUM":
                    realGsMoveInSilenceLikeLasagna[ak] = sum(ggg, avv);
                    break;
                case "COUNT":
                    realGsMoveInSilenceLikeLasagna[ak] = ggg.length;
                    break;
            }
        }
        realGs.push(realGsMoveInSilenceLikeLasagna);
    }
    return realGs;
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
