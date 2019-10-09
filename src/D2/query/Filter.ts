
export function f(thing: any, filt: any): boolean {
    const fk = Object.keys(filt)[0];
    const v = Object.values(filt)[0];
    switch (fk) {
        case "AND": return fAND(thing, v as any[]);
        case "OR": return fOR(thing, v as any[]);
        case "NOT": return !f(thing, v);
        case "GT": return fM(thing, v, "GT");
        case "LT": return fM(thing, v, "LT");
        case "EQ": return fM(thing, v, "EQ");
        case "IS": return fS(thing, v);
    }
}

export function fM(thing: any, filt: any, gtlteq: string) {
    const fk = Object.keys(filt)[0];
    const v = Object.values(filt)[0];
    const fkk = fk.split("_")[1];
    switch (gtlteq) {
        case "GT": return thing[fkk] > v;
        case "LT": return thing[fkk] < v;
        case "EQ": return thing[fkk] === v;
    }
}

export function fS(thing: any, filt: any) {
    const fk = Object.keys(filt)[0];
    const v = Object.values(filt)[0];
    const fkk = fk.split("_")[1];
    return thing[fkk] === v;
}

export function fAND(thing: any, arr: any[]): boolean {
    for (const filt of arr) {
        if (!f(thing, filt)) {
            return false;
        }
    }
    return true;
}

export function fOR(thing: any, arr: any[]): boolean {
    for (const filt of arr) {
        if (f(thing, filt)) {
            return false;
        }
    }
    return false;
}
