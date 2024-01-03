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
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
require("@testing-library/jest-dom");
const SWR = __importStar(require("swr"));
const chat_list_1 = __importDefault(require("../../components/chat-list"));
describe('List fetches listings then makes cards', () => {
    const mockChatroomsResponse = [
        {
            roomName: 'room0',
            password: '1234',
            isPublic: true,
            chatroomId: '4321',
        },
        {
            roomName: 'this Room1',
            password: '1234',
            isPublic: false,
            chatroomId: '4321',
        },
    ];
    const mockUserResponse = {
        firstName: 'thisUser0',
        lastName: 'lastName',
        username: 'username',
        chatrooms: [],
    };
    test('render chat cards in list', () => {
        jest
            .spyOn(SWR, 'default')
            .mockImplementation((url) => {
            if (url.includes('chatrooms')) {
                return {
                    data: mockChatroomsResponse,
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
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chat_list_1.default, null)));
        const chatroom1Name = react_2.screen.getByText('room0');
        expect(chatroom1Name).toBeInTheDocument();
        const room1IsPublic = react_2.screen.getByText('public');
        expect(room1IsPublic).toBeInTheDocument();
        const chatroom2Name = react_2.screen.getByText('this Room1');
        expect(chatroom2Name).toBeInTheDocument();
        const room2IsPublic = react_2.screen.getByText('private');
        expect(room2IsPublic).toBeInTheDocument();
    });
});
//# sourceMappingURL=chat-list.test.js.map