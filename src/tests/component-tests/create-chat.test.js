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
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const test_utils_1 = require("react-dom/test-utils");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const postFetch = __importStar(require("../../utility-functions/post-fetch"));
const create_chat_1 = __importDefault(require("../../components/create-chat"));
require("@testing-library/jest-dom");
describe('Create chat', () => {
    test('create chat renders for new non-edit chat.', () => __awaiter(void 0, void 0, void 0, function* () {
        const submitPost = jest
            .spyOn(postFetch, 'submitPost')
            .mockImplementation((arg1, arg2, e) => {
            e.preventDefault();
            return Promise.resolve();
        });
        // Mock fetch
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(create_chat_1.default, { isEdit: false, chatroom: null })));
        const chatNameInput = react_2.screen.getByLabelText('Chat Name:');
        const passwordInput = react_2.screen.getByLabelText('Password:');
        const passwordConfirmInput = react_2.screen.getByLabelText('Confirm password:');
        const createButton = react_2.screen.getByText('Create chat');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.type(chatNameInput, 'name test');
            yield user_event_1.default.type(passwordInput, '1234');
            yield user_event_1.default.type(passwordConfirmInput, '1234');
            yield user_event_1.default.click(createButton);
        }));
        expect(chatNameInput.value).toBe('name test');
        expect(passwordInput.value).toBe('1234');
        expect(passwordConfirmInput.value).toBe('1234');
        expect(submitPost).lastCalledWith('http://localhost:3000/chatrooms/new', expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), null, expect.anything());
    }));
});
//# sourceMappingURL=create-chat.test.js.map