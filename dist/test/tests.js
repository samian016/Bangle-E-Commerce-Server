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
const index_1 = __importDefault(require("../index"));
const globals_1 = require("@jest/globals");
const request = require('supertest');
(0, globals_1.describe)("GET / - a simple api endpoint", () => {
    (0, globals_1.test)("Hello API Request", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request(index_1.default).get("/");
        (0, globals_1.expect)(result.text).toEqual("hello");
        (0, globals_1.expect)(result.statusCode).toEqual(200);
    }));
});
