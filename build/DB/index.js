"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("../config/config");
const pool = new pg_1.Pool({
    user: config_1.postgreaSQL.user,
    host: config_1.postgreaSQL.host,
    database: config_1.postgreaSQL.database,
    password: config_1.postgreaSQL.password,
    port: config_1.postgreaSQL.port,
});
pool.connect().then(client => {
    console.log('Connected to PostgreSQL');
    client.release();
}).catch(err => console.error('Connection error', err.stack));
exports.default = pool;
