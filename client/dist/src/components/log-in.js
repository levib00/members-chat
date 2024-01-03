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
// LogIn functional component that handles user login
const LogIn = (props) => {
    const { hasAuth, setHasAuth } = props; // Destructuring props
    // State variables for managing username, password inputs, and validation errors
    const [usernameInput, setUsernameInput] = (0, react_1.useState)('');
    const [passwordInput, setPasswordInput] = (0, react_1.useState)('');
    const [validationError, setValidationError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)(); // Accessing navigation function from React Router
    (0, react_1.useEffect)(() => {
        if (hasAuth) {
            navigate('/'); // Redirect to the home page if already authenticated
        }
    });
    // Function to handle user login
    const logIn = (e) => {
        // Perform a POST request to log in the user
        (0, post_fetch_1.submitPost)('http://localhost:4832/users/log-in', { username: usernameInput, password: passwordInput }, e, post_fetch_1.validateLogIn, setValidationError, navigate, setHasAuth, // Update the authentication status after successful login
        () => null);
    };
    // JSX rendering for the LogIn component
    return (react_1.default.createElement("div", { className: 'main log-in-page' },
        react_1.default.createElement("form", { action: "", className: 'log-in-form form-container' },
            react_1.default.createElement("div", { className: 'log-in-input form-input' },
                react_1.default.createElement("label", { htmlFor: "username" }, "Username:"),
                react_1.default.createElement("input", { type: "text", id: "username", required: true, onChange: (e) => setUsernameInput(e.target.value), value: usernameInput })),
            react_1.default.createElement("div", { className: 'log-in-input form-input' },
                react_1.default.createElement("label", { htmlFor: "password" }, "Password:"),
                react_1.default.createElement("input", { type: "password", id: "password", required: true, onChange: (e) => setPasswordInput(e.target.value), value: passwordInput })),
            react_1.default.createElement("button", { onClick: (e) => logIn(e) }, "Log in"),
            validationError && (react_1.default.createElement("ul", null, Array.isArray(validationError)
                ? validationError.map((error) => react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, error))
                : react_1.default.createElement("li", { key: (0, uuid_1.v4)() }, validationError)))),
        react_1.default.createElement(react_router_dom_1.Link, { to: '/sign-up' }, "Don't have an account?")));
};
exports.default = LogIn;
//# sourceMappingURL=log-in.js.map