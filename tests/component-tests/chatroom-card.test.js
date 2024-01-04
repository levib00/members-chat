"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
const chatroom_card_1 = __importDefault(require("../../components/chatroom-card"));
require("@testing-library/jest-dom");
describe('Cards renders correct info', () => {
    const mockResponse = {
        roomName: 'room0',
        password: '1234',
        isPublic: true,
        _id: '4321',
    };
    test('Card shows with info', () => {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(chatroom_card_1.default, { chatroomInfo: mockResponse, hasUser: true })));
        const chatroomName = react_2.screen.getByText('room0');
        expect(chatroomName).toBeInTheDocument();
        const isPublic = react_2.screen.getByText('public');
        expect(isPublic).toBeInTheDocument();
    });
});
//# sourceMappingURL=chatroom-card.test.js.map