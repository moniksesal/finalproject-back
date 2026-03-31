const db = require('../db')

//últimos workouts con detalle de rutina y nº de ejercicios
const getLastWorkouts = async (user_id, limit = 5) => {
    const [rows] = await db.query(`
        SELECT w.id AS workout_id, w.fecha, w.feeling, r.id AS routine_id, r.nombre AS routine_nombre,
               COUNT(we.id) AS ejercicios_hechos
        FROM workouts w
        LEFT JOIN routines r ON w.routine_id = r.id
        LEFT JOIN workouts_exercises we ON we.workout_id = w.id
        WHERE w.user_id = ?
        GROUP BY w.id
        ORDER BY w.fecha DESC
        LIMIT ?`, [user_id, limit])
    return rows
}

//Stats: feelings y total de ejercicios
const getStats = async (user_id) => { //sum(feeling='dificil) es una comparacion booleana. si feeling es dificil devuelve 1, sino 0. 1 es verdad y 0 es falso
    const [[feelingStats]] = await db.query(`
        SELECT
            SUM(feeling='dificil') AS dificil, 
            SUM(feeling='justo') AS justo,
            SUM(feeling='facil') AS facil
        FROM workouts
        WHERE user_id = ?`, [user_id])

    const [[totalExercises]] = await db.query(`
        SELECT COUNT(*) AS total_exercises
        FROM workouts_exercises we
        JOIN workouts w ON we.workout_id = w.id
        WHERE w.user_id = ?`, [user_id])

    return {feelingStats, totalExercises: totalExercises.total_exercises}
}

//Rutinas del usuario
const getUserRoutines = async (user_id) => {
    const [rows] = await db.query(`
        SELECT id, nombre FROM routines WHERE user_id = ?`, [user_id])
    return rows
}

//Hábitos del usuario
const getHabits = async (user_id) => {
    const [rows] = await db.query('SELECT sueno, agua, tabaco, alcohol FROM habits WHERE user_id = ?', [user_id])
    return rows[0] || null
}

//Objetivo del usuario
const getObjective = async (user_id) => {
    const [rows] = await db.query(`
        SELECT o.id, o.name
        FROM users u
        LEFT JOIN objectives o ON u.objective_id = o.id
        WHERE u.id = ?`, [user_id])
    return rows[0] || null
}

//estadísticas de workouts del usuario en los últimos 7 días
const getWorkoutStats = async (user_id) => {
    const [rows] = await db.query(`
        SELECT COUNT(*) as total, 
            AVG(
                CASE feeling
                WHEN 'facil' THEN 1
                WHEN 'justo' THEN 2
                WHEN 'dificil' THEN 3
                END
            ) AS avgFeeling
        FROM workouts
        WHERE user_id = ? AND fecha >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `, [user_id]) //sacar el promedio de la columna feeling en los últimos 7 dias. convierte los feeling en numero para poder después hacer la condición en el controlador
    return rows[0]
}

module.exports = {getLastWorkouts, getStats, getUserRoutines, getHabits, getObjective, getWorkoutStats}