//gestiona la conexión a la base de datos MySQL utilizando mysql2/promise

const mysql = require('mysql2/promise')
require('dotenv').config()

const db = mysql.createPool({ //crea un pool de cnexiones a la base de datos, en vez de abrir y cerrar una conexión cada vez que haces una consulta
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, //si se llenanm espera hasta que haya una libre
    connectionLimit: 10, //hasta 10 conexiones simultáneas
    queueLimit: 0 // sin limite de filas en espera
})

module.exports = db