"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
// Error functional component
const Error = (props) => {
    const { error } = props;
    // State variables for managing status and info of the error
    const [status] = (0, react_1.useState)((error === null || error === void 0 ? void 0 : error.status) || 404);
    const [info] = (0, react_1.useState)((error === null || error === void 0 ? void 0 : error.info) || 'That page was not found.');
    // JSX rendering for displaying error details
    return (react_1.default.createElement("div", { className: "content" },
        react_1.default.createElement("p", null, "Something went wrong."),
        react_1.default.createElement("h2", null, status),
        react_1.default.createElement("p", null, info),
        react_1.default.createElement("a", { href: "/" }, " Return to Home")));
};
exports.default = Error;
//# sourceMappingURL=error.js.map