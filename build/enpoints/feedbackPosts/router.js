"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const checkAuth_1 = require("../checkAuth");
const rout = (0, express_1.Router)();
// rout.post('/register', controller.)
// rout.post('/login', controller.login)
rout.post('/create', checkAuth_1.checkauth, controller_1.default.create);
rout.delete('/:id', checkAuth_1.checkauth, controller_1.default.delete);
rout.patch('/:id', checkAuth_1.checkauth, controller_1.default.update);
rout.get('/User', checkAuth_1.checkauth, controller_1.default.getOneUser);
rout.get('/all', controller_1.default.getAll);
rout.get('/:id', checkAuth_1.checkauth, controller_1.default.getOne);
exports.default = rout;
