"use strict";
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
const create_chat_1 = __importDefault(require("../../../client/src/components/create-chat"));
const react_router_dom_1 = require("react-router-dom");
const test_utils_1 = require("react-dom/test-utils");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
describe("Chatroom gets messages then renders them", () => {
    const mockMessage = {
        username: 'thisUser0',
        timeStamp: 1599288716652,
        message: 'This is message 0',
    };
    test('renders messages in chatroom', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(create_chat_1.default, { setError: () => false })));
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
    }));
});
//# sourceMappingURL=create-chat.test.js.map