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
const swr_1 = __importDefault(require("swr"));
const uuid_1 = require("uuid");
const react_router_dom_1 = require("react-router-dom");
const fetcher_1 = require("../utility-functions/fetcher");
const chatroom_card_1 = __importDefault(require("./chatroom-card"));
// ChatroomList functional component
const ChatroomList = () => {
    const [adminInput, setAdminInput] = (0, react_1.useState)(''); // State for admin input
    const navigate = (0, react_router_dom_1.useNavigate)(); // Accessing the navigation function from React Router
    // Fetching user data using SWR
    const { data: user, error: userError } = (0, swr_1.default)('http://localhost:4832/users/user', fetcher_1.getFetcher);
    // Fetching chatroom data using SWR
    const { data: chatrooms } = (0, swr_1.default)('http://localhost:4832/chatrooms/', fetcher_1.getFetcher);
    // Redirecting to login page if there's an error fetching user data or user is not signed in
    (0, react_1.useEffect)(() => {
        if (userError) {
            navigate('/log-in');
        }
    }, [userError]);
    return (react_1.default.createElement("div", { className: 'main chat-list-page' },
        react_1.default.createElement("div", { className: 'admin-form' }, (user === null || user === void 0 ? void 0 : user.isAdmin) && react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("label", { htmlFor: 'admin-input' }, "Enter a username to make them an admin:"),
            react_1.default.createElement("div", { className: 'admin-inputs' },
                react_1.default.createElement("input", { type: 'text', id: 'admin-input', onChange: (e) => setAdminInput(e.target.value), value: adminInput }),
                react_1.default.createElement("button", null, "Submit")))),
        react_1.default.createElement(react_router_dom_1.Link, { className: 'create-chat-button', to: '/chatrooms/new' }, "Create a new chatroom"),
        (user && chatrooms)
            && react_1.default.createElement("div", { className: "chat-list" }, chatrooms.map((chatroom) => react_1.default.createElement(chatroom_card_1.default, { key: (0, uuid_1.v4)(), chatroomInfo: chatroom, hasUser: ((user === null || user === void 0 ? void 0 : user.chatrooms.includes(chatroom._id)) || (user === null || user === void 0 ? void 0 : user.isAdmin)) })))));
};
exports.default = ChatroomList;
//# sourceMappingURL=chat-list.js.map