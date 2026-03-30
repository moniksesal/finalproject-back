// Representación de la tabla SQL en código

const db = require('../db')
const bcrypt = require('bcrypt') // para encriptar contraseñas

const User = {
    //Crear un nuevo usuario
    create: async ({nombre, email, password, edad, objective_id, plan}) => {
        try {
            //Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10) //transforma la contraseña original en un código irreconocible. 10 es el num de rondas de encriptación, cuanto mayor, más seguro pero más lento. 10 es num estandar.

            const [result] = await db.execute( //db.execute(query, valores) mejor usar execute porque hay contraseña, es más seguro que query
                'INSERT INTO users (nombre, email, password, edad, objective_id, plan) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, email, hashedPassword, edad, objective_id, plan] //se hace asi para evitar SQL injection
            ) //devuelve [result, fields] solo nos interesa result, por eso lo desestructuramos

            return {
                id: result.insertId,
                nombre,
                email,
                edad,
                objective_id,
                plan: plan || 'free'
            }


        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`)
        }
    },

    // Buscar user por email
    findByEmail: async (email) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email])
        return rows[0]
    },

    //Buscar el usuario por id
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id])
        return rows[0]
    },

    //Comprobnar contraseña
    comparePassword: async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword)
    }
}

module.exports = User


/* db.execute(), el primer elemento es el resultado de la consulta.
Si es un INSERT/UPDATE/DELETE, al objeto con info lo llamamos [result] --> Resultado de una operación --> objeto con info de la operación: insertId, affectedRows, warninStatus, usamos normalmente el insertId
Si es un SELECT, al objeto con info lo llamamos [rows] --> Filas devueltas* --> Rows devuelve objetos completos(filas)*/