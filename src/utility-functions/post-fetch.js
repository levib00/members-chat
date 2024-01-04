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
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitPost = exports.validateMakeAdmin = exports.validateLeaveChatroom = exports.validateLogIn = exports.validateSignUp = exports.validateJoinChatroom = exports.validateCreateDeleteMessage = exports.validateMessageEdit = exports.validateCreateChat = void 0;
// Validation function for creating a chat room
const validateCreateChat = (response, navigate, setValidationError) => __awaiter(void 0, void 0, void 0, function* () {
    // Check the response status
    if (response.status === 200) {
        navigate('/members-chat/chatrooms'); // Redirect if successful
        return response.status;
    }
    // Handle errors by setting validation errors
    const errorResponse = yield response.json();
    setValidationError(errorResponse.error);
    return errorResponse;
});
exports.validateCreateChat = validateCreateChat;
// Validate message edit function
const validateMessageEdit = (response, navigate, setValidationError, setHasAuth, // A parameter that seems to be unused or explicitly set as null
sendMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = yield response.json();
    if (response.status === 200) {
        const stringifiedResponse = JSON.stringify(jsonResponse);
        sendMessage(stringifiedResponse); // If successful, send the message
    }
    else {
        setValidationError(jsonResponse.error); // Set validation error if not successful
    }
    return jsonResponse;
});
exports.validateMessageEdit = validateMessageEdit;
// Validate create delete message function
const validateCreateDeleteMessage = (response, navigate, setValidationError, setHasAuth, // Similar unused or explicitly set null parameter
sendMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = yield response.json();
    if (response.status === 200) {
        const stringifiedResponse = JSON.stringify(yield jsonResponse);
        sendMessage(stringifiedResponse); // If successful, send the message
    }
    else {
        setValidationError(yield jsonResponse.error); // Set validation error if not successful
    }
    return jsonResponse;
});
exports.validateCreateDeleteMessage = validateCreateDeleteMessage;
// Validate join chat room function
const validateJoinChatroom = (response, navigate, setValidationError) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonResponse = yield response.json();
    if (response.status === 200) {
        localStorage.setItem('jwt', yield jsonResponse.token);
        navigate(`/members-chat/chatrooms/${jsonResponse.chatroomId}`); // Redirect to chat room if successful
        return response.status;
    }
    if (jsonResponse.error) {
        setValidationError(jsonResponse.error); // Set validation error if there's an error in response
        return jsonResponse.error;
    }
    return jsonResponse;
});
exports.validateJoinChatroom = validateJoinChatroom;
// Function for handling sign-up validation
const validateSignUp = (response, navigate, setValidationError) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.status === 200) {
        navigate('/members-chat/'); // Redirect to home page if successful
        return response.status;
    }
    if (response.status === 401) {
        setValidationError('Username or password are invalid.'); // Set validation error for specific status
        return response.status;
    }
    // Handle other errors by parsing the response and setting validation errors
    const errorResponse = yield response.json();
    setValidationError(errorResponse.error);
    return errorResponse;
});
exports.validateSignUp = validateSignUp;
// Validate login function
const validateLogIn = (response, navigate, setValidationError, setHasAuth) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.status === 200) {
        const tokenObject = yield response.json();
        localStorage.setItem('jwt', yield tokenObject.token);
        setHasAuth(true); // Set authentication to true on successful login
        navigate('/members-chat/'); // Redirect to home page
        return response.status;
    }
    if (response.status === 401) {
        setValidationError('Wrong username or password.'); // Set validation error for wrong credentials
        return response.status;
    }
    const errorResponse = yield response.json();
    setValidationError(errorResponse.error); // Set validation error from response
    return errorResponse;
});
exports.validateLogIn = validateLogIn;
// Validate leave chat room function
const validateLeaveChatroom = (response, navigate, setValidationError) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.status === 200) {
        const tokenObject = yield response.json();
        localStorage.setItem('jwt', yield tokenObject.token);
        navigate('/members-chat/chatrooms'); // Redirect to chat rooms on successful leaving
        return response;
    }
    const errorResponse = yield response.json();
    setValidationError(errorResponse.error); // Set validation error if leaving fails
    return errorResponse;
});
exports.validateLeaveChatroom = validateLeaveChatroom;
// Validate make admin function
const validateMakeAdmin = (response, navigate, setValidationError) => __awaiter(void 0, void 0, void 0, function* () {
    if (response.status === 200) {
        const tokenObject = yield response.json();
        localStorage.setItem('jwt', yield tokenObject.token);
        return response;
    }
    const errorResponse = yield response.json();
    setValidationError(errorResponse.error); // Set validation error if making admin fails
    return errorResponse;
});
exports.validateMakeAdmin = validateMakeAdmin;
// Function for submitting a POST request
const submitPost = (url, body, e, validationFunction, setValidationError, navigate, setHasAuth, sendMessage) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault(); // Prevent default behavior of the event
    try {
        const response = yield fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: 'include',
            // @ts-ignore
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://localhost:5173',
                Authorization: (() => {
                    const token = localStorage.getItem('jwt');
                    if (token) {
                        return `Bearer ${token}`;
                    }
                    return null;
                })(),
            },
            mode: 'cors',
        });
        // Call the provided validation function based on the response status
        return yield validationFunction(response, navigate, setValidationError, setHasAuth, sendMessage);
    }
    catch (error) {
        setValidationError(error); // Set validation error in case of an error
        return error;
    }
});
exports.submitPost = submitPost;
//# sourceMappingURL=post-fetch.js.map