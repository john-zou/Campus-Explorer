// Needs to be restructured to return a list of tables
// May be a good idea to do some actual parsing on the table
export function tablesearch(doc: Document): Document[] {
    if (doc.nodeName === "table") {
        return [doc];
    }
    let docs: Document[] = [];
    for (const i in doc.childNodes) {
        const cnode = doc.childNodes[i];
        // Call table search recursively
        const possibleTable: Document = this.tablesearch(cnode);
        // Check if table found in recursive call
        if (possibleTable !== null) {
            docs.push(possibleTable);
        }
    }
    if (docs !== []) {
        return docs;
    }
    // Nothing found
    return null;
}
