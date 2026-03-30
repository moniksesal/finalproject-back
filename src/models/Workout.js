const db = require('../db')

const createWorkout = async (user_id, {routine_id, fecha, feeling, exercises}) => {
    // Crear workout
    const [result] = await db.query(
        'INSERT INTO workouts (user_id, routine_id, fecha, feeling) VALUES (?, ?, ?, ?)',
        [user_id, routine_id, fecha, feeling]
    )
    const workout_id = result.insertId

    if (!Array.isArray(exercises) || exercises.length === 0) {
        return workout_id // no hay ejercicios que insertar
    }

    //insertar ejercicios y series
    for (let ex of exercises) {
        //si ex.series no es array lo transformamos en array vacío
        const seriesArray = Array.isArray(ex.series) ? ex.series : []

        if (!ex.id) {
            console.warn('Warning: ejercicio sin id recibido', ex)
            continue
        }

        let serie_num = 1
        for (let serie of seriesArray) {
            //asegurarse de que repeticiones y peso existan
            const reps = serie.repeticiones ?? 0 //si serie.repeticiones es null o undefined, reps tomará el valor de ??, que es 0
            const peso = serie.peso ?? 0

            await db.query(
                'INSERT INTO workouts_exercises (workout_id, exercise_id, serie_num, repeticiones, peso) VALUES (?, ?, ?, ?, ?)',
                [workout_id, ex.id, serie_num, reps, peso]
            )

            serie_num++
        }
    }

    return workout_id
}

const getWorkoutsByUser = async (user_id) => {
    const [workouts] = await db.query(
        'SELECT * FROM workouts WHERE user_id = ?',
        [user_id]
    )
    
    for (let workout of workouts) {
        const [exercises] = await db.query(
            `SELECT we.id AS workout_exercise_id, e.nombre, we.serie_num, we.repeticiones, we.peso FROM workouts_exercises we JOIN exercises e ON e.id = we.exercise_id WHERE we.workout_id = ?`,
            [workout.id]
        )
        workout.exercises = exercises
    }
    return workouts
}

const getWorkoutById = async (workout_id, user_id) => {
    const [rows] = await db.query(`
        SELECT 
            w.id AS workout_id,
            w.fecha,
            w.feeling,
            r.id AS routine_id,
            r.nombre AS routine_nombre,
            e.id AS exercise_id,
            e.nombre AS exercise_nombre,
            we.serie_num,
            we.repeticiones,
            we.peso
        FROM workouts w
        LEFT JOIN routines r ON w.routine_id = r.id
        LEFT JOIN workoutS_exercises we ON w.id = we.workout_id
        LEFT JOIN exercises e ON we.exercise_id = e.id
        WHERE w.id = ? AND w.user_id = ?
    `, [workout_id, user_id])

    return rows
}

const updateWorkout = async (workout_id, {fecha, feeling, exercises}) => {
    //actualizar tabla workouts
    await db.query(
        'UPDATE workouts SET fecha = ?, feeling = ? WHERE id = ?',
        [fecha, feeling, workout_id]
    )

    //si hay ejs, borramos los actuales y añadimos los nuevos
    if (Array.isArray(exercises) && exercises.length > 0) {
        await db.query('DELETE FROM workouts_exercises WHERE workout_id = ?', [workout_id])

        for (let ex of exercises) {
            const seriesArray = Array.isArray(ex.series) ? ex.series : []
            let serie_num = 1

            for (let serie of seriesArray) {
                const reps = serie.repeticiones ?? 0 //si serie.repeticiones es null o undefinec lo pone a 0
                const peso = serie.peso ?? 0

                await db.query(
                    'INSERT INTO workouts_exercises (workout_id, exercise_id, serie_num, repeticiones, peso) VALUES (?, ?, ?, ?, ?)',
                    [workout_id, ex.id, serie_num, reps, peso]
                )

                serie_num++
            }
        }
    }
    return workout_id
}

const deleteWorkout = async (workout_id) => {
    const [result] = await db.query('DELETE FROM workouts WHERE id = ?', [workout_id])
    return result.affectedRows
}



module.exports = {createWorkout, getWorkoutsByUser, getWorkoutById, updateWorkout, deleteWorkout}