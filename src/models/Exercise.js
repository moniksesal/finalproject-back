const db = require('../db')

// crear ejercicio (solo premium)
const createExercise = async ({name, description, image_url, video_url, user_id}) => {
    const [result] = await db.query(
        `INSERT INTO exercises (nombre, descripcion, imagen_url, video_url, user_id) VALUES (?, ?, ?, ?, ?)`,
        [name, description, image_url, video_url, user_id]
    )
    return result.insertId
}

// obtener ejercicios (globales + personalizados)
const getExercises = async (user_id) => {
    const [rows] = await db.query(
        `SELECT * FROM exercises WHERE user_id IS NULL OR user_id = ?`,
        [user_id]
    )
    return rows
}

//actualizar ejercicio personalizado
const updateExercise = async ({id, user_id, nombre, descripcion, imagen_url, video_url}) => {
    const [result] = await db.query(
        `UPDATE exercises SET nombre = ?, descripcion = ?, imagen_url = ?, video_url = ? WHERE id = ? AND user_id = ?`,
        [nombre, descripcion, imagen_url, video_url, id, user_id]
    )
    return result.affectedRows
}

//eliminar ejercicio personalizado
const deleteExercise = async (id, user_id) => {
    const [result] = await db.query(
        `DELETE FROM exercises WHERE id = ? AND user_id = ?`,
        [id, user_id]
    )
    return result.affectedRows
}

module.exports = {createExercise, getExercises, updateExercise, deleteExercise}