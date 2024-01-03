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
const chatroom_1 = __importDefault(require("../../../client/src/components/chatroom"));
const react_router_dom_1 = require("react-router-dom");
require("@testing-library/jest-dom");
const SWR = __importStar(require("swr"));
describe("Chatroom gets messages then renders them", () => {
    const mockResponse = [
        {
            username: 'thisUser0',
            timeStamp: 1599288716652,
            message: 'This is message 0',
        },
        {
            username: 'thisUser1',
            timeStamp: 1593288716652,
            message: 'This is message 1',
        }
    ];
    test('renders messages in chatroom', () => {
        jest
            .spyOn(SWR, 'default')
            .mockImplementation(() => ({ data: mockResponse, isValidating: false, mutate: () => Promise.resolve() }));
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_1.default, null)));
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
});
//# sourceMappingURL=chatroom.test.js.map