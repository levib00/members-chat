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
const nav_js_1 = __importDefault(require("./components/nav.js"));
const home_js_1 = __importDefault(require("./components/home.js"));
const sign_up_js_1 = __importDefault(require("./components/sign-up.js"));
require("./styles/App.scss");
const chat_list_js_1 = __importDefault(require("./components/chat-list.js"));
const chatroom_js_1 = __importDefault(require("./components/chatroom.js"));
const create_chat_js_1 = __importDefault(require("./components/create-chat.js"));
const log_in_js_1 = __importDefault(require("./components/log-in.js"));
const error_js_1 = __importDefault(require("./components/error.js"));
const footer_js_1 = __importDefault(require("./components/footer.js"));
const App = () => {
    const [error, setError] = (0, react_1.useState)();
    const [hasAuth, setHasAuth] = (0, react_1.useState)(!!localStorage.getItem('jwt'));
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
            react_1.default.createElement(nav_js_1.default, { hasAuth: hasAuth, setHasAuth: setHasAuth }),
            react_1.default.createElement(react_router_dom_1.Routes, null,
                react_1.default.createElement(react_router_dom_1.Route, { path: '/', element: react_1.default.createElement(home_js_1.default, { hasAuth: hasAuth }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/chatrooms', element: react_1.default.createElement(chat_list_js_1.default, null) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/chatrooms/:chatroomId', element: react_1.default.createElement(chatroom_js_1.default, { setError: setError }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/chatrooms/new', element: react_1.default.createElement(create_chat_js_1.default, { isAnEdit: false, chatroom: null }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/log-in', element: react_1.default.createElement(log_in_js_1.default, { hasAuth: hasAuth, setHasAuth: setHasAuth }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/sign-up', element: react_1.default.createElement(sign_up_js_1.default, { hasAuth: hasAuth }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '/error', element: react_1.default.createElement(error_js_1.default, { error: error }) }),
                react_1.default.createElement(react_router_dom_1.Route, { path: '*', element: react_1.default.createElement(error_js_1.default, { error: error }) })),
            react_1.default.createElement(footer_js_1.default, null))));
};
exports.default = App;
//# sourceMappingURL=App.js.map