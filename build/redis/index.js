"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnect = void 0;
const config_1 = require("../config/config");
exports.redisConnect = {
    redis: {
        host: config_1.redis.host,
        port: config_1.redis.port
    }
};
