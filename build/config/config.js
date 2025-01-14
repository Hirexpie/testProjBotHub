"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.postgreaSQL = exports.http = void 0;
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const fileContent = fs_1.default.readFileSync('config.yml', 'utf8');
const config = js_yaml_1.default.load(fileContent);
exports.http = config.http;
exports.postgreaSQL = config.postgreaSQL;
exports.redis = config.redis;
