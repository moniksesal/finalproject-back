// gestiona la conexión a la base de datos MySQL utilizando mysql2/promise
const mysql = require('mysql2/promise')
require('dotenv').config()

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false   //Permite la conexión segura con Aiven
    }
})

module.exports = db;