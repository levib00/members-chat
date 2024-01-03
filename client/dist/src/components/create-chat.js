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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const uuid_1 = require("uuid");
const post_fetch_1 = require("../utility-functions/post-fetch");
// CreateChat functional component
const CreateChat = (props) => {
    const { isAnEdit, chatroom } = props;
    // State variables for managing input fields and their values
    const [chatNameInput, setChatNameInput] = (0, react_1.useState)((chatroom === null || chatroom === void 0 ? void 0 : chatroom.roomName) || '');
    const [passwordInput, setPasswordInput] = (0, react_1.useState)('');
    const [confirmPasswordInput, setConfirmPasswordInput] = (0, react_1.useState)('');
    const [validationError, setValidationError] = (0, react_1.useState)('');
    const [isTheSame] = (0, react_1.useState)(passwordInput === confirmPasswordInput);
    const [isPublic, setIsPublic] = (0, react_1.useState)((chatroom === null || chatroom === void 0 ? void 0 : chatroom.isPublic) || false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const { chatroomId } = (0, react_router_dom_1.useParams)(); // Retrieving chatroom ID from URL parameters
    const submitForm = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (isTheSame) {
            // Handling submission for editing an existing chatroom
            if (isAnEdit) {
                try {
                    // Performing a PUT request to update an existing chatroom
                    const response = yield fetch(`http://localhost:4832/chatrooms/edit/${chatroomId}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            roomName: chatNameInput,
                            password: isPublic ? '' : passwordInput,
                            passwordConfirmation: isPublic ? '' : confirmPasswordInput,
                            isPublic,
                        }),
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
                    (0, post_fetch_1.validateCreateChat)(response, navigate, setValidationError);
                }
                catch (error) {
                    setValidationError(error); // Give error to user.
                }
            }
            else {
                // Handling submission for creating a new chatroom
                (0, post_fetch_1.submitPost)('http://localhost:4832/chatrooms/new', {
                    roomName: chatNameInput,
                    password: passwordInput,
                    passwordConfirmation: confirmPasswordInput,
                    isPublic,
                }, e, post_fetch_1.validateCreateChat, setValidationError, navigate, null, () => null);
            }
        }
        else {
            setValidationError('Passwords don\'t match.');
        }
    });
    return (react_1.default.createElement("div", { className: 'main create-chat-page' },
        react_1.default.createElement("form", { className: 'create-chat-form form-container' },
            react_1.default.createElement("div", { className: 'create-chat-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'chat-name' }, "Chat Name:"),
                react_1.default.createElement("input", { type: 'text', id: 'chat-name', required: true, onChange: (e) => setChatNameInput(e.target.value), value: chatNameInput })),
            react_1.default.createElement("div", { className: 'create-chat-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'password' }, "Password:"),
                react_1.default.createElement("input", { disabled: isPublic, type: 'password', id: 'password', onChange: (e) => setPasswordInput(e.target.value), value: isPublic ? '' : passwordInput })),
            react_1.default.createElement("div", { className: 'create-chat-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'confirm-password' }, "Confirm password:"),
                react_1.default.createElement("input", { disabled: isPublic, type: 'password', id: 'confirm-password', onChange: (e) => setConfirmPasswordInput(e.target.value), value: isPublic ? '' : confirmPasswordInput })),
            react_1.default.createElement("div", { className: 'create-chat-input form-input' },
                react_1.default.createElement("label", { htmlFor: "isPublic" }, "Do you want this server to be public?"),
                react_1.default.createElement("input", { id: "isPublic", type: "checkbox", onChange: (e) => setIsPublic(e.target.checked), checked: isPublic })),
            react_1.default.createElement("button", { onClick: (e) => submitForm(e) }, isAnEdit ? 'Submit changes' : 'Create chat'),
            validationError
                && react_1.default.createElement("ul", null, Array.isArray(validationError)
                    ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                    : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError)))));
};
exports.default = CreateChat;
//# sourceMappingURL=create-chat.js.map