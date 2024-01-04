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
require("@testing-library/jest-dom");
const SWR = __importStar(require("swr"));
const test_utils_1 = require("react-dom/test-utils");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const submitPost = __importStar(require("../../utility-functions/post-fetch"));
const chatroom_1 = __importDefault(require("../../components/chatroom"));
const setErrorMock = jest.fn();
describe('Chatroom gets messages then renders them', () => {
    const mockUser = {
        _id: '123456',
        firstName: 'thisUser0',
        lastName: 'lastName',
        username: 'thisUser0',
        chatrooms: [],
    };
    const mockUser2 = {
        firstName: 'thisUser0',
        lastName: 'lastName',
        username: 'thisUser1',
        chatrooms: [],
    };
    const mockMessageResponse = {
        chatroom: {
            roomName: 'this Room1',
            password: '1234',
            isPublic: false,
            chatroomId: '4321',
            createdBy: '123456',
        },
        messages: [
            {
                username: mockUser,
                timestamp: 1599288716652,
                content: 'This is message 0',
            },
            {
                username: mockUser2,
                timestamp: 1593288716652,
                content: 'This is message 1',
            },
        ],
    };
    const mockUserResponse = {
        _id: '123456',
        firstName: 'thisUser0',
        lastName: 'lastName',
        username: 'username',
        chatrooms: [],
    };
    jest
        .spyOn(SWR, 'default')
        .mockImplementation((url) => {
        if (url.includes('messages')) {
            return {
                data: mockMessageResponse,
                isValidating: false,
                mutate: () => Promise.resolve(),
            };
        }
        if (url.includes('users')) {
            return {
                data: mockUserResponse,
                isValidating: false,
                mutate: () => Promise.resolve(),
            };
        }
        return null;
    });
    test('renders messages in chatroom', () => {
        // TODO: fix act error.
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, { setError: setErrorMock })));
        const Message1Username = react_2.screen.getByText('thisUser0');
        expect(Message1Username).toBeInTheDocument();
        const room1Initial = react_2.screen.getByText('5/8/2020');
        expect(room1Initial).toBeInTheDocument();
        const room1IsPublic = react_2.screen.getByText('This is message 0');
        expect(room1IsPublic).toBeInTheDocument();
        const Message2Username = react_2.screen.getByText('thisUser1');
        expect(Message2Username).toBeInTheDocument();
        const room2Initial = react_2.screen.getByText('27/5/2020');
        expect(room2Initial).toBeInTheDocument();
        const room2IsPublic = react_2.screen.getByText('This is message 1');
        expect(room2IsPublic).toBeInTheDocument();
    });
    test('message is sent', () => __awaiter(void 0, void 0, void 0, function* () {
        submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');
        // TODO: fix act error.
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, { setError: setErrorMock })));
        const messageInput = react_2.screen.getByRole('textbox');
        const submitButton = react_2.screen.getByText('Send');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.type(messageInput, 'message');
            yield user_event_1.default.click(submitButton);
        }));
        expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
    }));
    test('leave chat request is sent leave chat.', () => __awaiter(void 0, void 0, void 0, function* () {
        submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');
        // TODO: fix act error.
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, { setError: setErrorMock })));
        const leaveButton = react_2.screen.getByText('Leave chat');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.click(leaveButton);
        }));
        expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
    }));
    test('edit modal works.', () => __awaiter(void 0, void 0, void 0, function* () {
        submitPost.submitPost = jest.fn().mockImplementationOnce(() => 'test');
        // TODO: fix act error.
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, { setError: setErrorMock })));
        const submitButton = react_2.screen.getByText('Edit chatroom');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.click(submitButton);
        }));
        const cancelButton = react_2.screen.getByText('cancel');
        expect(cancelButton).toBeInTheDocument();
    }));
    test('validation errors show.', () => __awaiter(void 0, void 0, void 0, function* () {
        submitPost.submitPost = jest.fn().mockImplementationOnce(() => ({ error: ['error'] }));
        // TODO: fix act error.
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, { setError: setErrorMock })));
        const messageInput = react_2.screen.getByRole('textbox');
        const submitButton = react_2.screen.getByText('Send');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.type(messageInput, '300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, 300+ characters, ');
            yield user_event_1.default.click(submitButton);
        }));
        expect(submitPost.submitPost).toHaveBeenCalledTimes(1);
        const errorMessage = react_2.screen.getByText('error');
        expect(errorMessage).toBeInTheDocument();
    }));
});
//# sourceMappingURL=chatroom.test.js.map