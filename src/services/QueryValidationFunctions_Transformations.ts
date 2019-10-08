import { QueryValidationResultFlag as F } from "./IQueryValidator";
import { MFIELDS_COURSES, MFIELDS_ROOMS } from "../query_schema/MFields";
import { InsightDatasetKind } from "../controller/IInsightFacade";
import { parseKeystring } from "./QueryValidationFunctions_Body";
import { SFIELDS_COURSES, SFIELDS_ROOMS } from "../query_schema/SFields";

export function validateTransformations(t: any, id: string,
                                        kind: InsightDatasetKind): F {
    // Always has a group, always has an apply
    if (t == null || typeof t !== "object") {
        return F.TransformationsIsNotAnObject;
    }
    const keys = Object.keys(t);
    if (!keys.includes("GROUP")) {
        return F.TransformationsIsMissingGroup;
    }
    if (!keys.includes("APPLY")) {
        return F.TransformationsIsMissingGroup;
    }
    if (keys.length !== 2) {
        return F.TransformationsDoesntHaveTwoKeys;
    }
    const gRes: F = validateGroup(t.GROUP, id, kind);
    if (gRes !== F.Valid) {
        return gRes;
    }
    const aRes: F = validateApply(t.APPLY);
    if (aRes !== F.Valid) {
        return aRes;
    }

    // All checks passed
    return F.Valid;
}

export function validateGroup(g: any, id: string, kind: InsightDatasetKind): F {
    if (!Array.isArray(g)) {
        return F.GroupIsNotAnArray;
    }
    if (g.length === 0) {
        return F.GroupMustBeNonEmptyArray;
    }
    for (const k of g) {
        if (!validateKey(k, id, kind)) {
            return F.InvalidKey;
        }
    }
    return F.Valid;
}

export function validateKey(k: any, id: string, kind: InsightDatasetKind): boolean {
    const res: [F, string, string] = parseKeystring(id);
    if (res[0] !== F.Valid) {
        return false;
    }
    const parsedId = res[1];
    const field = res[2];
    if (parsedId !== id) {
        return false;
    }
    switch (kind) {
        case InsightDatasetKind.Courses:
            return MFIELDS_COURSES.includes(field) || SFIELDS_COURSES.includes(field);
        case InsightDatasetKind.Rooms:
            return MFIELDS_ROOMS.includes(field) || SFIELDS_ROOMS.includes(field);

    }
}

export function validateApply(a: any): F {
    if (!Array.isArray(a)) {
        return F.ApplyIsNotAnArray;
    }
    if (a.length === 0) {
        return F.ApplyMustBeNonEmptyArray;
    }
    return F.Valid;
}
