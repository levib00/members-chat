"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const react_router_dom_1 = require("react-router-dom");
require("@testing-library/jest-dom");
const home_1 = __importDefault(require("../../../client/src/components/home"));
describe("Chatroom gets messages then renders them", () => {
    test('renders error message', () => {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(home_1.default, { hasAuth: false })));
        const greeting = react_2.screen.getByText('Join to start chatting now!');
        expect(greeting).toBeInTheDocument();
        const signUpLink = react_2.screen.getByText('Sign up now!');
        expect(signUpLink).toBeInTheDocument();
    });
});
//# sourceMappingURL=home.test.js.map