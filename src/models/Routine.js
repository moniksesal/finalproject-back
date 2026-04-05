const db = require('../db')

const Routine = {
    createRoutine: async ({user_id, nombre}) => {
        const [result] = await db.query(
            'INSERT INTO routines (user_id, nombre) VALUES (?, ?)',
            [user_id, nombre]
        )
        return result.insertId
    },

    // asociar dias a la rutina
    addRoutineDays: async ({routine_id, user_id, dias}) => {
        for (let dia of dias) {
            await db.query(
                'INSERT INTO routine_days (routine_id, user_id, dia) VALUES (?, ?, ?)',
                [routine_id, user_id, dia]
            )
        }
    },

    // obtener rutinas por user
    getRoutinesByUser: async (user_id) => {
        const [rows] = await db.query(
            'SELECT * FROM routines WHERE user_id = ?',
            [user_id]
        )

        for (let row of rows) {
            const [days] = await db.query(
                'SELECT dia FROM routine_days WHERE routine_id = ?',
                [row.id]
            )
            row.dias = days.map(d=>d.dia)
        }
        return rows
    },

    //obtener rutina por id
    getRoutineById: async (routine_id) => {
        //rutina
        const [routineRows] = await db.query(
            'SELECT * FROM routines WHERE id = ?',
            [routine_id]
        )
        if (routineRows.length === 0) return null
        const routine = routineRows[0]

        //dias
        const [daysRows] = await db.query(
            'SELECT dia FROM routine_days WHERE routine_id = ?',
            [routine_id]
        )
        routine.dias = daysRows.map(row => row.dia)

        //ejercicios
        const [exercisesRows] = await db.query(
            'SELECT re.id, re.series, re.repeticiones, re. descanso, e.nombre, e.descripcion, e.imagen_url, e.video_url FROM routine_exercises re JOIN exercises e ON re.exercise_id = e.id WHERE re.routine_id = ?',
            [routine_id]
        )

        routine.exercises = exercisesRows
        return routine
    },

    //traer los dias
    getRoutineDays: async (routine_id) => {
        const [rows] = await db.query(
            'SELECT dia FROM routine_days WHERE routine_id = ?',
            [routine_id]
        )
        return rows.map(r => r.dia)
    },

    //borrar rutina por id (y sus dias y ejs asociados)
    deleteRoutine: async (routine_id) => {
        // borrar ejercicios asociados
        await db.query('DELETE FROM routine_exercises WHERE routine_id = ?', [routine_id])
        // borrar días asociados
        await db.query('DELETE FROM routine_days WHERE routine_id = ?', [routine_id])
        // borrar la rutina
        const [result] = await db.query('DELETE FROM routines WHERE id = ?', [routine_id])
        return result.affectedRows; //devuelve 1 si borró algo
    }
}

module.exports = Routine