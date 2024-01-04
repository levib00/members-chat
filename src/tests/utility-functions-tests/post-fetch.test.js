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
Object.defineProperty(exports, "__esModule", { value: true });
/* *
*@jest-environment node
*/
// @ts-nocheck
const utils = __importStar(require("../../utility-functions/post-fetch"));
describe('Post fetch Create chat.', () => {
    test('Create chat navigates to chatrooms on good response', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: jest.fn(() => 'works') }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateCreateChat, setValidationError, navigate, null, sendMessage);
        expect(navigate).toBeCalledWith('/chatrooms');
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateCreateChat, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch sign Up', () => {
    test('Submit Post navigates to home on good response', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: jest.fn(() => 'works') }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateSignUp, setValidationError, navigate, null, sendMessage);
        expect(navigate).toBeCalledWith('/');
    }));
    test('Sets wrong username or password message on 401 error. ', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({ status: 401, json: jest.fn(() => 'works') }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateSignUp, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Username or password are invalid.');
    }));
    test('Adds errors sent from server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateSignUp, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch log in', () => {
    test('Sets wrong username or password message on 401 error. ', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({ status: 401, json: jest.fn(() => 'works') }));
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        global.localStorage = localStorageMock;
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const setHasAuth = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateLogIn, setValidationError, navigate, setHasAuth, sendMessage);
        expect(setValidationError).toBeCalledWith('Wrong username or password.');
    }));
    test('Adds error from server errors', () => __awaiter(void 0, void 0, void 0, function* () {
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        global.localStorage = localStorageMock;
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({
                error: 'Something went wrong. Please try again.',
            })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const setHasAuth = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateLogIn, setValidationError, navigate, setHasAuth, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch Make Admin.', () => {
    test('Happy path.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 200,
            json: jest.fn(() => ({ token: 'token' })),
        }));
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        global.localStorage = localStorageMock;
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateMakeAdmin, setValidationError, navigate, null, sendMessage);
        expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateMakeAdmin, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch Leave Chatroom.', () => {
    test('Happy path.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 200,
            json: jest.fn(() => ({ token: 'token' })),
        }));
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        global.localStorage = localStorageMock;
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateLeaveChatroom, setValidationError, navigate, null, sendMessage);
        expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateLeaveChatroom, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch Join Chatroom.', () => {
    test('Happy path.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 200,
            json: jest.fn(() => ({ token: 'token' })),
        }));
        const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        global.localStorage = localStorageMock;
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateJoinChatroom, setValidationError, navigate, null, sendMessage);
        expect(localStorageMock.setItem).toBeCalledWith('jwt', 'token');
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateJoinChatroom, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch Create/Delete message', () => {
    test('Happy path.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 200,
            json: jest.fn(() => ({ message: 'message' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateCreateDeleteMessage, setValidationError, navigate, null, sendMessage);
        const jsonResponse = { message: 'message' };
        expect(sendMessage).toBeCalledWith(JSON.stringify(jsonResponse));
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateCreateDeleteMessage, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
describe('Post fetch edit Message.', () => {
    test('Happy path.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 200,
            json: jest.fn(() => ({ message: 'message' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateMessageEdit, setValidationError, navigate, null, sendMessage);
        const jsonResponse = { message: 'message' };
        expect(sendMessage).toBeCalledWith(JSON.stringify(jsonResponse));
    }));
    test('Adds errors sent from the server.', () => __awaiter(void 0, void 0, void 0, function* () {
        global.fetch = jest.fn(() => Promise.resolve({
            status: 403,
            json: jest.fn(() => ({ error: 'Something went wrong. Please try again.' })),
        }));
        const url = 'localhost:8000';
        const e = { preventDefault: jest.fn() };
        const sendMessage = jest.fn();
        const setValidationError = jest.fn();
        const navigate = jest.fn();
        const mockBody = { one: '', two: '', three: '' };
        yield utils.submitPost(url, mockBody, e, utils.validateMessageEdit, setValidationError, navigate, null, sendMessage);
        expect(setValidationError).toBeCalledWith('Something went wrong. Please try again.');
    }));
});
//# sourceMappingURL=post-fetch.test.js.map