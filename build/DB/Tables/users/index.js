"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUsers = void 0;
const index_1 = __importDefault(require("../../index"));
const checkUsers = () => {
    index_1.default.query('select * from users').catch(() => {
        index_1.default.query(`
            create table users (
                userId SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                nikname VARCHAR(100) NOT NULL UNIQUE,
                passHash VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                avatar BYTEA,
                createAt TIMESTAMP,
                updateAt TIMESTAMP
            )
        `);
        console.log('users table created');
        return;
    });
};
exports.checkUsers = checkUsers;
