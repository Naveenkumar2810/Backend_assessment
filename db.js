const mysql = require("mysql2");
const env = require("dotenv");
const path = require('path')


env.config({path:path.join(__dirname,'config','conf.env')})

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const promisePool = pool.promise();

module.exports = promisePool;
