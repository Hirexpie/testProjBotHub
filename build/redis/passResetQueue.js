"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passResetQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const index_1 = require("./index");
exports.passResetQueue = new bull_1.default('paswordResetQueue', index_1.redisConnect);
