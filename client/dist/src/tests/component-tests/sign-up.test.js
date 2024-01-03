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
const sign_up_1 = __importDefault(require("../../components/sign-up"));
require("@testing-library/jest-dom");
describe('Sign up', () => {
    const submitPost = jest
        .spyOn(postFetch, 'submitPost')
        .mockImplementation((arg1, arg2, e) => {
        e.preventDefault();
        return Promise.resolve();
    });
    test('shows dom and sends request on button press.', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, react_2.render)(react_1.default.createElement(react_router_dom_1.MemoryRouter, null,
            react_1.default.createElement(sign_up_1.default, { setError: jest.fn(), setHasAuth: jest.fn(), hasAuth: false })));
        const usernameInput = react_2.screen.getByLabelText('Username:');
        const passwordInput = react_2.screen.getByLabelText('Password:');
        const createButton = react_2.screen.getByText('Sign up');
        yield (0, test_utils_1.act)(() => __awaiter(void 0, void 0, void 0, function* () {
            yield user_event_1.default.type(usernameInput, 'name test');
            yield user_event_1.default.type(passwordInput, '1234');
            yield user_event_1.default.click(createButton);
        }));
        expect(usernameInput.value).toBe('name test');
        expect(passwordInput.value).toBe('1234');
        expect(submitPost).lastCalledWith('http://localhost:3000/users/sign-up', expect.anything(), expect.anything(), expect.anything(), expect.anything(), expect.anything(), null, expect.anything());
    }));
});
//# sourceMappingURL=sign-up.test.js.map