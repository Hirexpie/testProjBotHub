"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const init_1 = require("./DB/init");
const router_1 = __importDefault(require("./enpoints/auth/router"));
const router_2 = __importDefault(require("./enpoints/feedbackPosts/router"));
const router_3 = __importDefault(require("./enpoints/Discussion/router"));
const config_1 = require("./config/config");
const PORT = config_1.http.port;
(0, init_1.initDB)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', router_1.default);
app.use('/feedback', router_2.default);
app.use('/discussion', router_3.default);
const main = () => {
    app.listen(4040, () => {
        console.log(`server to start in port:${PORT}`);
    });
};
main();
