const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: '***',
    password: '*******',
    database: 'lost_found_portal'
});

module.exports = db;
