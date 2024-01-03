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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const uuid_1 = require("uuid");
const post_fetch_1 = require("../utility-functions/post-fetch");
// SignUp functional component for user registration
const SignUp = (props) => {
    const { hasAuth } = props; // Destructuring props
    // States to manage form inputs and validation errors
    const [firstNameInput, setFirstNameInput] = (0, react_1.useState)('');
    const [lastNameInput, setLastNameInput] = (0, react_1.useState)('');
    const [usernameInput, setUsernameInput] = (0, react_1.useState)('');
    const [passwordInput, setPasswordInput] = (0, react_1.useState)('');
    const [confirmPasswordInput, setConfirmPasswordInput] = (0, react_1.useState)('');
    const [validationError, setValidationError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)(); // Hook for navigating between pages
    (0, react_1.useEffect)(() => {
        // Redirect if user is already logged in
        if (hasAuth) {
            navigate('/');
        }
    });
    // Function to handle user registration (sign-up)
    const signUp = (e) => {
        (0, post_fetch_1.submitPost)('http://localhost:4832/users/sign-up', {
            firstName: firstNameInput,
            lastName: lastNameInput,
            username: usernameInput,
            password: passwordInput,
            passwordConfirmation: confirmPasswordInput,
        }, e, post_fetch_1.validateSignUp, // Validation function for sign-up
        setValidationError, navigate, null, () => null);
    };
    // JSX for the sign-up form
    return (react_1.default.createElement("div", { className: 'main sign-up-page' },
        react_1.default.createElement("form", { action: "", className: 'sign-up-form form-container' },
            react_1.default.createElement("div", { className: 'sign-up-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'first-name' }, "First name:"),
                react_1.default.createElement("input", { type: 'text', id: 'first-name', required: true, onChange: (e) => setFirstNameInput(e.target.value), value: firstNameInput })),
            react_1.default.createElement("div", { className: 'sign-up-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'last-name' }, "Last name:"),
                react_1.default.createElement("input", { type: 'text', id: 'last-name', required: true, onChange: (e) => setLastNameInput(e.target.value), value: lastNameInput })),
            react_1.default.createElement("div", { className: 'sign-up-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'username' }, "Username:"),
                react_1.default.createElement("input", { type: 'text', id: 'username', required: true, onChange: (e) => setUsernameInput(e.target.value), value: usernameInput })),
            react_1.default.createElement("div", { className: 'sign-up-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'password' }, "Password:"),
                react_1.default.createElement("input", { type: 'text', id: 'password', required: true, onChange: (e) => setPasswordInput(e.target.value), value: passwordInput })),
            react_1.default.createElement("div", { className: 'sign-up-input form-input' },
                react_1.default.createElement("label", { htmlFor: 'confirm-password' }, "Confirm Password:"),
                react_1.default.createElement("input", { type: "text", id: 'confirm-password', required: true, onChange: (e) => setConfirmPasswordInput(e.target.value), value: confirmPasswordInput })),
            react_1.default.createElement("button", { onClick: (e) => signUp(e) }, "Sign up"),
            // Display validation errors if any
            validationError && (react_1.default.createElement("ul", null, Array.isArray(validationError)
                ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError)))),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/log-in' }, "Already have an account?")));
};
exports.default = SignUp;
//# sourceMappingURL=sign-up.js.map