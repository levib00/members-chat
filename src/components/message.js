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
const dom_parser_1 = __importDefault(require("../utility-functions/dom-parser"));
// Message functional component that displays a message and manages its actions
function Message(props) {
    const { messageInfo, currentUser, sendMessage, handleNewWsMessage, isBeingEdited, deleteConfirmation, toggleEditing, toggleDeleteModal, } = props;
    // Destructuring message information
    const { username, timestamp, content, _id: id, } = messageInfo;
    // State variables for managing message input, validation error, date, navigation
    const [messageInput, setMessageInput] = (0, react_1.useState)(() => (0, dom_parser_1.default)(content));
    const [validationError, setValidationError] = (0, react_1.useState)('');
    const date = new Date(timestamp);
    const navigate = (0, react_router_dom_1.useNavigate)();
    // Function to delete a message
    const deleteMessage = () => __awaiter(this, void 0, void 0, function* () {
        // Update the UI with the deleted message
        toggleDeleteModal();
        handleNewWsMessage({ _id: messageInfo._id });
        try {
            // Perform a DELETE request to delete the message
            const response = yield fetch(`http://localhost:3000/messages/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                // @ts-ignore
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    Authorization: (() => {
                        const token = localStorage.getItem('jwt');
                        if (token) {
                            return `Bearer ${token}`;
                        }
                        return null;
                    })(),
                },
                mode: 'cors',
            });
            // Validate the deletion and handle potential errors
            (0, post_fetch_1.validateCreateDeleteMessage)(response, navigate, setValidationError, null, sendMessage);
        }
        catch (error) {
            setValidationError(error); // Redirect to an error page if there's a non-validation error
        }
    });
    // Function to send an edited message
    const sendEdit = () => __awaiter(this, void 0, void 0, function* () {
        toggleEditing(); // Toggle the editing state
        // Update the message content and send it
        handleNewWsMessage({
            username,
            timestamp: date,
            content: messageInput,
            _id: id,
        });
        try {
            // Perform a PUT request to edit the message
            const response = yield fetch(`http://localhost:3000/messages/edit/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ content: messageInput }),
                credentials: 'include',
                // @ts-ignore
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:5173',
                    Authorization: (() => {
                        const token = localStorage.getItem('jwt');
                        if (token) {
                            return `Bearer ${token}`;
                        }
                        return null;
                    })(),
                },
                mode: 'cors',
            });
            // Validate the message edit and handle potential errors
            (0, post_fetch_1.validateMessageEdit)(response, navigate, setValidationError, null, sendMessage);
        }
        catch (error) {
            setValidationError(error); // show user an error if one is received.
        }
    });
    // JSX rendering for displaying the message and its actions
    return (react_1.default.createElement("div", { className: 'message' },
        deleteConfirmation && react_1.default.createElement("div", { className: 'delete-modal' },
            react_1.default.createElement("div", { className: 'modal-text' },
                react_1.default.createElement("p", null, "Are you sure you want to delete this message?"),
                react_1.default.createElement("p", null,
                    "\"",
                    (0, dom_parser_1.default)(content),
                    "\"")),
            react_1.default.createElement("div", { className: 'modal-buttons' },
                react_1.default.createElement("button", { onClick: deleteMessage }, "confirm"),
                react_1.default.createElement("button", { onClick: toggleDeleteModal }, "cancel"))),
        react_1.default.createElement("div", { className: 'spacer' }),
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: 'inline' },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: 'message-username' }, (0, dom_parser_1.default)(username === null || username === void 0 ? void 0 : username.username)),
                    react_1.default.createElement("div", { className: 'message-date' }, `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`)),
                (((currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) && currentUser._id === (username === null || username === void 0 ? void 0 : username._id)) || (currentUser === null || currentUser === void 0 ? void 0 : currentUser.isAdmin))
                    && react_1.default.createElement("div", { className: 'message-button-container' },
                        (((currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) === username._id) && (isBeingEdited
                            ? react_1.default.createElement("button", { onClick: toggleEditing },
                                react_1.default.createElement(react_2.default, { path: js_1.mdiCloseThick, title: 'close', size: 1 })) : react_1.default.createElement("button", { onClick: toggleEditing },
                            react_1.default.createElement(react_2.default, { path: js_1.mdiSquareEditOutline, title: 'edit', size: 1 })))),
                        isBeingEdited
                            ? react_1.default.createElement("button", { onClick: sendEdit },
                                react_1.default.createElement(react_2.default, { path: js_1.mdiCheckBold, title: 'confirm', size: 1 })) : react_1.default.createElement("button", { onClick: toggleDeleteModal },
                            react_1.default.createElement(react_2.default, { path: js_1.mdiDelete, title: 'delete', size: 1 })))),
            react_1.default.createElement("div", { className: 'message-content' }, isBeingEdited ? react_1.default.createElement("textarea", { onChange: (e) => setMessageInput(e.target.value), value: messageInput })
                : (0, dom_parser_1.default)(content))),
        validationError
            && react_1.default.createElement("ul", null, Array.isArray(validationError)
                ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError))));
}
exports.default = Message;
//# sourceMappingURL=message.js.map