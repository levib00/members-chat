"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const message_1 = __importDefault(require("../../../client/src/components/message"));
const react_router_dom_1 = require("react-router-dom");
require("@testing-library/jest-dom");
describe("Chatroom gets messages then renders them", () => {
    const mockMessage = {
        username: 'thisUser0',
        timeStamp: 1599288716652,
        message: 'This is message 0',
    };
    test('renders messages in chatroom', () => {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(message_1.default, { messageInfo: mockMessage })));
        const Message1Username = react_2.screen.getByText('thisUser0');
        expect(Message1Username).toBeInTheDocument();
        const room1Initial = react_2.screen.getByText('5/8/2020');
        expect(room1Initial).toBeInTheDocument();
        const room1IsPublic = react_2.screen.getByText('This is message 0');
        expect(room1IsPublic).toBeInTheDocument();
    });
});
//# sourceMappingURL=message.test.js.map