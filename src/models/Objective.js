const db = require('../db')

//obtener todos los objetivos
const getObjectives = async () => {
    const [rows] = await db.query('SELECT * FROM objectives')
    return rows
}

//Actualizar objetivo de un usuario
const updateUserObjective = async (user_id, objective_id) => {
    const [result] = await db.query(
        'UPDATE users SET objective_id = ? WHERE id = ?',
        [objective_id, user_id]
    )
    return result.affectedRows
}

//devuelve el objetivo actual del user
const getUserObjective = async (user_id) => {
    const [rows] = await db.query(
        `SELECT o.id, o.name 
         FROM users u
         JOIN objectives o ON u.objective_id = o.id
         WHERE u.id = ?`,
        [user_id]
    )
    return rows[0] || null
}

module.exports = {getObjectives, updateUserObjective, getUserObjective}