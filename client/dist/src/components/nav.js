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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_2 = __importDefault(require("@mdi/react"));
const js_1 = require("@mdi/js");
// NavBar functional component that displays navigation links based on authentication status
function NavBar(props) {
    const { hasAuth, setHasAuth } = props; // Destructuring props
    const [isMoreHidden, setIsMoreHidden] = (0, react_1.useState)(true);
    // Function to handle user sign out
    const signOut = () => {
        setIsMoreHidden(true);
        setHasAuth(false); // Update authentication status to false
        localStorage.removeItem('jwt'); // Remove JWT token from localStorage
    };
    // JSX rendering for navigation buttons based on authentication status
    return (react_1.default.createElement("nav", { onMouseLeave: () => setIsMoreHidden(true) }, !hasAuth
        // eslint-disable-next-line operator-linebreak
        ? // Display these links if user is not authenticated
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { hidden: isMoreHidden },
                    react_1.default.createElement("div", { className: "hamburger-menu" },
                        react_1.default.createElement(react_router_dom_1.Link, { className: 'menu-nav', to: '/members-chat/log-in' }, "Log in"),
                        react_1.default.createElement(react_router_dom_1.Link, { className: 'menu-nav', to: '/members-chat/sign-up' }, "Sign up"),
                        react_1.default.createElement("p", null,
                            "Made by",
                            ' ',
                            react_1.default.createElement("a", { className: 'github-link', href: "https://github.com/levib00" }, "levib00 on GitHub")))),
                react_1.default.createElement("div", { className: 'main-nav' },
                    react_1.default.createElement(react_router_dom_1.Link, { className: 'hero main-nav-button', to: '/members-chat/' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiHome, title: 'home', size: 1 }),
                        react_1.default.createElement("div", null, "Home")),
                    react_1.default.createElement(react_router_dom_1.Link, { className: 'side-nav main-nav-button', to: '/members-chat/log-in' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiLogin, title: 'login', size: 1 }),
                        react_1.default.createElement("div", null, "Log in")),
                    react_1.default.createElement(react_router_dom_1.Link, { className: 'side-nav main-nav-button', to: '/members-chat/sign-up' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiAccountPlus, title: 'sign-up', size: 1 }),
                        react_1.default.createElement("div", null, "Sign up")),
                    react_1.default.createElement("button", { onClick: () => setIsMoreHidden(!isMoreHidden), className: 'more-menu main-nav-button' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiDotsHorizontalCircleOutline, title: 'more', size: 1 }),
                        react_1.default.createElement("div", null, "More"))))
        // eslint-disable-next-line operator-linebreak
        : // Display these links if user is authenticated
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { hidden: isMoreHidden, tabIndex: 0, onBlur: () => setIsMoreHidden(true) },
                    react_1.default.createElement("div", { className: "hamburger-menu" },
                        react_1.default.createElement("button", { className: 'menu-nav', onClick: signOut }, "Log Out"),
                        react_1.default.createElement("p", null,
                            "Made by",
                            ' ',
                            react_1.default.createElement("a", { className: 'github-link', href: "https://github.com/levib00" }, "levib00 on GitHub")))),
                react_1.default.createElement("div", { className: 'main-nav' },
                    react_1.default.createElement(react_router_dom_1.Link, { className: 'hero main-nav-button', to: '/members-chat/' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiHome, title: 'home', size: 1 }),
                        react_1.default.createElement("div", null, "Home")),
                    react_1.default.createElement(react_router_dom_1.Link, { className: 'main-nav-button', to: '/members-chat/chatrooms' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiForum, title: 'chatrooms', size: 1 }),
                        react_1.default.createElement("div", null, "Chatrooms")),
                    react_1.default.createElement("button", { className: 'side-nav main-nav-button', onClick: signOut },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiLogout, title: 'logout', size: 1 }),
                        react_1.default.createElement("div", null, "Log Out")),
                    react_1.default.createElement("button", { onClick: () => setIsMoreHidden(!isMoreHidden), className: 'more-menu main-nav-button' },
                        react_1.default.createElement(react_2.default, { path: js_1.mdiDotsHorizontalCircleOutline, title: 'more', size: 1 }),
                        react_1.default.createElement("div", null, "More"))))));
}
exports.default = NavBar;
//# sourceMappingURL=nav.js.map