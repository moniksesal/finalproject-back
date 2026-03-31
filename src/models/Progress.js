const db = require('../db')

//Progreso de peso
const getWeightProgress = async (user_id) => {
    const [rows] = await db.query(`
        SELECT w.id AS workout_id,
            w.fecha,
            ROUND(SUM(we.peso * we.repeticiones) / SUM(we.repeticiones), 2) AS peso_promedio
        FROM workouts w
        JOIN workouts_exercises we ON we.workout_id = w.id
        WHERE w.user_id = ?
        GROUP BY w.id
        ORDER BY w.fecha ASC
    `, [user_id]) //peso promedio teniendo en cuenta las repeticiones de cada serie
    return rows
}

module.exports = getWeightProgress