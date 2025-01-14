"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkauth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkauth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    try {
        if (!token) {
            res.status(401).json({ message: 'Ошибка аутентификации' });
            return;
        }
        const decoded = jsonwebtoken_1.default.decode(token);
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Ошибка аутентификации' });
        return;
    }
};
exports.checkauth = checkauth;
