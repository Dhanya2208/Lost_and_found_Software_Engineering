const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dhanya@2005',
    database: 'lost_found_portal'
});

module.exports = db;
