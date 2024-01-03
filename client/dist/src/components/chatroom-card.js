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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const uuid_1 = require("uuid");
const react_2 = __importDefault(require("@mdi/react"));
const js_1 = require("@mdi/js");
const post_fetch_1 = require("../utility-functions/post-fetch");
// ChatroomCard functional component
const ChatroomCard = (props) => {
    const { chatroomInfo, hasUser } = props;
    const { roomName, isPublic, _id: id } = chatroomInfo;
    const [passwordInput, setPasswordInput] = (0, react_1.useState)(''); // State for user input of password
    const [validationError, setValidationError] = (0, react_1.useState)(''); // State for validation errors
    // State to track if user is in the process of joining
    const [isJoining, setIsJoining] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)(); // Accessing the navigation function from React Router
    // Function handling the join/chat button click
    const clickJoin = (e) => __awaiter(void 0, void 0, void 0, function* () {
        if ((!isJoining && !isPublic) && !hasUser) {
            setIsJoining(true);
        }
        else if (hasUser) {
            navigate(`/chatrooms/${id}`);
        }
        else {
            // Sending a POST request to join the chatroom
            const response = yield (0, post_fetch_1.submitPost)(`http://localhost:4832/users/join/${id}`, { password: passwordInput }, e, post_fetch_1.validateJoinChatroom, setValidationError, navigate, null, () => null);
            if (typeof (yield response) !== 'undefined') {
                navigate(`/chatrooms/${id}`);
            }
        }
    });
    return (react_1.default.createElement("div", { className: 'chatroom-card' },
        react_1.default.createElement("div", null, roomName),
        " ",
        react_1.default.createElement("div", null, isPublic ? react_1.default.createElement("div", { className: 'lock-status locked' },
            react_1.default.createElement(react_2.default, { path: js_1.mdiLockOpen, size: 1, title: 'unlocked' }),
            react_1.default.createElement("div", null, "public")) : react_1.default.createElement("div", { className: 'lock-status locked' },
            react_1.default.createElement(react_2.default, { path: js_1.mdiLock, size: 1, title: 'locked' }),
            react_1.default.createElement("div", null, "private"))),
        " ",
        isJoining ? react_1.default.createElement("input", { type: "password", onChange: (e) => setPasswordInput(e.target.value), value: passwordInput }) : null,
        react_1.default.createElement("button", { onClick: (e) => clickJoin(e) }, hasUser ? 'Chat' : 'Join'),
        " ",
        validationError
            && react_1.default.createElement("ul", null, Array.isArray(validationError)
                ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError))));
};
exports.default = ChatroomCard;
//# sourceMappingURL=chatroom-card.js.map