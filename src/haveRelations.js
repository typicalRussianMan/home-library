export function haveRelations(dep, req, field) {
    for (const el of dep) {
        if (el[field] === req) return true
    }
    return false;
}