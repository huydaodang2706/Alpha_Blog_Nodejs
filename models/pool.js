const util = require('util');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "huydaodang",
    password: "haithanh1234",
    database: "alpha_blog"
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Some thing went wrong connecting database');
        throw err;
    }
    if (connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;