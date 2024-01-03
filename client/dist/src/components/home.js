"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
// Home functional component that displays different content based on authentication status
const Home = (props) => {
    const { hasAuth } = props;
    // Rendering different content based on the authentication status
    return (react_1.default.createElement("div", { className: 'main home-page' }, !hasAuth ? ( // Display when the user doesn't have authentication
    react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h2", null, "Join to start chatting now!"),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/sign-up' }, "Sign up now!"))) : ( // Display when the user has authentication
    react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("h2", null, "Start chatting now!"),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/chatrooms' }, "See servers!")))));
};
exports.default = Home;
//# sourceMappingURL=home.js.map