export function tablesearch(doc: Document): Document {
    if (doc.nodeName === "table") {
        return doc;
    }
    for (const cnode in document.childNodes) {
        // Call table search recursively
        const possibleTable: Document = this.tablesearch(cnode);
        // Check if table found in recursive call
        if (possibleTable != null) {
            return possibleTable;
        }
    }
    return null;
}
