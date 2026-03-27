const db = require('../db')

const Routine = {
    createRoutine: async ({user_id, nombre}) => {
        [result] = await db.query(
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
        return rows
    }
}

module.exports = Routine