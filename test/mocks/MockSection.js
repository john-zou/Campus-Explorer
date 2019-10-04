"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockSection {
    constructor() {
        this.dept = "mock";
        this.id = "mock";
        this.avg = -1;
        this.instructor = "mock";
        this.title = "mock";
        this.pass = -1;
        this.fail = -1;
        this.audit = -1;
        this.year = -1;
        this.uuid = "mock";
    }
    setUuid(uuid) {
        throw new Error("Method not implemented.");
    }
    static getMockSections(n) {
        let sections = [];
        for (let i = 0; i < n; ++i) {
            const section = new MockSection();
            section.uuid = i.toString();
            sections.push(section);
        }
        return sections;
    }
}
exports.MockSection = MockSection;
//# sourceMappingURL=MockSection.js.map