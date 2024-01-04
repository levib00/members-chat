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
exports.getFetcher = void 0;
const getFetcher = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield fetch(url, {
            method: 'GET',
            // @ts-ignore
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                // Gets JSON web token and format it for API.
                Authorization: (() => {
                    const token = localStorage.getItem('jwt');
                    if (token) {
                        return `Bearer ${token}`;
                    }
                    return null;
                })(),
            },
            // 'Access-Control-Allow-Origin': '*',
            mode: 'cors',
        });
        return yield data.json();
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.getFetcher = getFetcher;
//# sourceMappingURL=fetcher.js.map