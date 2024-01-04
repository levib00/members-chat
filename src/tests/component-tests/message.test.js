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
require("@testing-library/jest-dom");
const submitPost = __importStar(require("../../utility-functions/post-fetch"));
const message_1 = __importDefault(require("../../components/message"));
describe('Messages renders', () => {
    const mockUser = {
        _id: '132456789011',
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'thisUser0',
        chatrooms: [],
    };
    const mockMessage = {
        username: mockUser,
        timestamp: 1599288716652,
        content: 'This is message 0',
        _id: '132456789011',
    };
    test('renders message', () => {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(message_1.default, { messageInfo: mockMessage, key: 1, index: 0, toggleEditing: jest.fn(), toggleDeleteModal: jest.fn(), currentUser: mockUser, sendMessage: jest.fn(), handleNewWsMessage: jest.fn(), isBeingEdited: false, deleteConfirmation: true })));
        const Message1Username = react_2.screen.getAllByText('thisUser0');
        expect(Message1Username).toBeTruthy();
        const room1Initial = react_2.screen.getByText('5/8/2020');
        expect(room1Initial).toBeInTheDocument();
        const room1IsPublic = react_2.screen.getByText('This is message 0');
        expect(room1IsPublic).toBeInTheDocument();
    });
    test('delete sends request', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve(),
        }));
        submitPost.validateCreateDeleteMessage = jest.fn();
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(message_1.default, { messageInfo: mockMessage, key: 1, index: 0, toggleEditing: jest.fn(), toggleDeleteModal: jest.fn(), currentUser: mockUser, sendMessage: jest.fn(), handleNewWsMessage: jest.fn(), isBeingEdited: false, deleteConfirmation: true })));
        const confirmButton = react_2.screen.getByText('confirm');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.click(confirmButton);
        }));
        expect(submitPost.validateCreateDeleteMessage).toHaveBeenCalledTimes(1);
    }));
});
//# sourceMappingURL=message.test.js.map