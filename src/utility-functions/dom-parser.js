"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseDom = (str) => {
    // Parses special characters from html code to unicode characters.
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return doc.documentElement.textContent || '';
};
exports.default = parseDom;
//# sourceMappingURL=dom-parser.js.map