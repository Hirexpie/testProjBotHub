"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const Discussion_1 = require("./Tables/Discussion");
const Feetback_1 = require("./Tables/Feetback");
const users_1 = require("./Tables/users");
const config_1 = require("../config/config");
const initDB = () => {
    (0, users_1.checkUsers)();
    (0, Feetback_1.checkCategory)(config_1.postgreaSQL.filters.category);
    (0, Feetback_1.checkStatus)(config_1.postgreaSQL.filters.status);
    (0, Feetback_1.checkFeetbacs)();
    (0, Discussion_1.checkDiscussion)();
};
exports.initDB = initDB;
