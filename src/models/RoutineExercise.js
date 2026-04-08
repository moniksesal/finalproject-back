const db = require('../db')

const addExerciseToRoutine = async (routine_id, exercises) => {
    // si ejs no lelga como array, lo forzamos
    const items = Array.isArray(exercises) ? exercises : []

    for (let ex of items) {
        await db.query(
            'INSERT INTO routine_exercises (routine_id, exercise_id, series, repeticiones, descanso) VALUES (?, ?, ?, ?, ?)',
            [
                routine_id,
                ex.exercise_id,
                ex.series,
                ex.repeticiones,
                ex.descanso
            ]
        )
    }
}

module.exports = addExerciseToRoutine