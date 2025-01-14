"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const rout = (0, express_1.Router)();
rout.post('/register', controller_1.default.register);
rout.post('/login', controller_1.default.login);
rout.post('/getCodeReset', controller_1.default.getCodeResetPass);
rout.post('/isCode', controller_1.default.isCodeResetPass);
rout.post('/resrtPass', controller_1.default.ResetPass);
exports.default = rout;
