"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
require("@testing-library/jest-dom");
const error_1 = __importDefault(require("../../components/error"));
describe('Chatroom gets messages then renders them', () => {
    test('renders error message', () => {
        const errorMock = {
            status: 403,
            info: 'Forbidden',
        };
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(error_1.default, { error: errorMock })));
        const statusCode = react_2.screen.getByText('403');
        expect(statusCode).toBeInTheDocument();
        const errorMessage = react_2.screen.getByText('Forbidden');
        expect(errorMessage).toBeInTheDocument();
    });
});
//# sourceMappingURL=error.test.js.map