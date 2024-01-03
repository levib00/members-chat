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
const swr_1 = __importDefault(require("swr"));
const react_router_dom_1 = require("react-router-dom");
const uuid_1 = require("uuid");
const react_use_websocket_1 = __importDefault(require("react-use-websocket"));
const fetcher_1 = require("../utility-functions/fetcher");
const post_fetch_1 = require("../utility-functions/post-fetch");
const message_1 = __importDefault(require("./message"));
const create_chat_1 = __importDefault(require("./create-chat"));
const Chatroom = (props) => {
    const { setError } = props;
    const { chatroomId } = (0, react_router_dom_1.useParams)(); // Retrieving the chatroom ID from the URL parameters
    const navigate = (0, react_router_dom_1.useNavigate)(); // Accessing the navigation function from React Router
    const [messageInput, setMessageInput] = (0, react_1.useState)('');
    const [modalIsOpen, setModalIsOpen] = (0, react_1.useState)(false);
    const [validationError, setValidationError] = (0, react_1.useState)('');
    const [leavingError, setLeavingError] = (0, react_1.useState)('');
    const [isBeingEdited, setIsBeingEdited] = (0, react_1.useState)(null);
    const [deleteConfirmation, setDeleteConfirmation] = (0, react_1.useState)(null);
    const [jwt] = (0, react_1.useState)(localStorage.getItem('jwt'));
    const { sendMessage, lastJsonMessage } = (0, react_use_websocket_1.default)(`ws://localhost:3000/ws?token=${jwt}&chatroomId=${chatroomId}`, {
        // Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: () => true,
    }); // TODO: set to wss in prod also change other links to https
    // Fetching user data using SWR (Stale-while-revalidate) pattern
    const { data: user } = (0, swr_1.default)('http://localhost:4832/users/user', fetcher_1.getFetcher);
    // Fetching chatroom messages data using SWR
    const { data: response, error: commentError, mutate } = (0, swr_1.default)(`http://localhost:4832/messages/chatroom/${chatroomId}`, fetcher_1.getFetcher);
    // Handling error states and redirection in case of errors
    (0, react_1.useEffect)(() => {
        setError(commentError);
        if (commentError) {
            navigate('/error');
        }
    }, [commentError]);
    const handleNewWsMessage = (message) => {
        var _a;
        const objIndex = (_a = response === null || response === void 0 ? void 0 : response.messages) === null || _a === void 0 ? void 0 : _a.findIndex(((obj) => obj._id === (message === null || message === void 0 ? void 0 : message._id)));
        if (objIndex < 0) { // Add non-existing message to DOM.
            const newMessages = [...response.messages, message];
            mutate(Object.assign(Object.assign({}, response), { messages: newMessages }), { revalidate: false });
        }
        else if (!(message === null || message === void 0 ? void 0 : message.content)) { // Remove from DOM.
            const newMessages = [...response.messages];
            newMessages.splice(objIndex, 1);
            mutate(Object.assign(Object.assign({}, response), { messages: newMessages }), { revalidate: false });
        }
        else { // Edit existing message.
            const newMessages = [...response.messages];
            newMessages[objIndex] = message;
            mutate(Object.assign(Object.assign({}, response), { messages: newMessages }), { revalidate: false });
        }
    };
    const handleSendMessage = (e) => __awaiter(void 0, void 0, void 0, function* () {
        // Logic to handle sending a message in the chatroom
        if (messageInput.length < 1) {
            return;
        }
        setMessageInput('');
        const date = new Date(Date.now());
        handleNewWsMessage({
            username: user,
            timestamp: date,
            content: messageInput,
        });
        const jsonResponse = yield (0, post_fetch_1.submitPost)(`http://localhost:4832/messages/${chatroomId}`, { content: messageInput }, e, post_fetch_1.validateCreateDeleteMessage, setValidationError, navigate, null, sendMessage);
        if (yield jsonResponse.error) {
            handleNewWsMessage({});
            setValidationError(jsonResponse.error.map((error) => error));
        }
        else {
            mutate();
        }
    });
    const leaveChat = (e) => {
        // Logic to handle leaving the chatroom
        (0, post_fetch_1.submitPost)(`http://localhost:4832/users/leave/${chatroomId}`, { content: messageInput }, e, post_fetch_1.validateLeaveChatroom, setLeavingError, navigate, null, () => null);
    };
    (0, react_1.useEffect)(() => {
        if (lastJsonMessage !== null) {
            handleNewWsMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);
    return (react_1.default.createElement("div", { className: 'main chatroom-page' },
        (modalIsOpen
            && react_1.default.createElement("div", null,
                react_1.default.createElement(create_chat_1.default, { chatroom: response === null || response === void 0 ? void 0 : response.chatroom, isAnEdit: true }),
                react_1.default.createElement("button", { onClick: () => setModalIsOpen(false) }, "cancel"))),
        react_1.default.createElement("div", { className: 'chatroom-header' },
            react_1.default.createElement("h2", null, response === null || response === void 0 ? void 0 : response.chatroom.roomName),
            react_1.default.createElement("div", { className: 'chatroom-header-buttons' },
                ((response === null || response === void 0 ? void 0 : response.chatroom.createdBy) === (user === null || user === void 0 ? void 0 : user._id))
                    ? react_1.default.createElement("button", { onClick: () => setModalIsOpen(true) }, "Edit chatroom") : null,
                react_1.default.createElement("button", { onClick: (e) => leaveChat(e) }, "Leave chat"),
                leavingError || null)),
        react_1.default.createElement("div", { className: 'message-list' }, (response === null || response === void 0 ? void 0 : response.messages.length) > 0 ? [...response.messages].reverse().map((message, index) => react_1.default.createElement(message_1.default, { key: ((0, uuid_1.v4)()), index: index, toggleEditing: () => setIsBeingEdited((s) => (s === index ? null : index)), toggleDeleteModal: () => setDeleteConfirmation((s) => (s === index ? null : index)), currentUser: user, messageInfo: message, sendMessage: sendMessage, handleNewWsMessage: handleNewWsMessage, isBeingEdited: isBeingEdited === index, deleteConfirmation: deleteConfirmation === index }))
            : react_1.default.createElement("div", { className: 'no-messages-fallback message' }, "Be the first to send a message!")),
        react_1.default.createElement("div", { className: 'create-message' },
            react_1.default.createElement("div", { className: 'message-form' },
                react_1.default.createElement("label", { className: 'message-box-label', htmlFor: "message-box" }),
                react_1.default.createElement("textarea", { id: "message-box", className: 'message-box', required: true, minLength: 1, maxLength: 300, onChange: (e) => setMessageInput(e.target.value), value: messageInput }),
                react_1.default.createElement("button", { onClick: (e) => handleSendMessage(e) }, "Send")),
            react_1.default.createElement("div", null, validationError
                && react_1.default.createElement("ul", null, Array.isArray(validationError)
                    ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                    : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError))))));
};
exports.default = Chatroom;
//# sourceMappingURL=chatroom.js.map