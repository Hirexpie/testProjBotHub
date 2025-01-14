"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkAuth_1 = require("../checkAuth");
const controller_1 = __importDefault(require("./controller"));
const rout = (0, express_1.Router)();
rout.post('/:feedbackid', checkAuth_1.checkauth, controller_1.default.create);
rout.patch('/:discussionid', checkAuth_1.checkauth, controller_1.default.update);
rout.delete('/:discussionid', checkAuth_1.checkauth, controller_1.default.delete);
rout.get('/:feedbackid', controller_1.default.getAll);
// rout.get('/:id')
exports.default = rout;
