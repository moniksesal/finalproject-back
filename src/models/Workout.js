const db = require('../db')

const Workout = {
    // Crear workout
    createWorkout: async (user_id, { routine_id, fecha, feeling, exercises }) => {
        //cabecera del entrenamiento
        const [result] = await db.query(
            'INSERT INTO workouts (user_id, routine_id, fecha, feeling) VALUES (?, ?, ?, ?)',
            [user_id, routine_id, fecha || new Date(), feeling]
        )
        const workout_id = result.insertId

        //Si hay ejercicios, insertar en bloque
        if (Array.isArray(exercises) && exercises.length > 0) {
            const values = []
            
            exercises.forEach((ex) => {
                const idParaInsertar = ex.exercise_id || ex.id
                
                if (idParaInsertar && Array.isArray(ex.series)) {
                    ex.series.forEach((serie, index) => {
                        values.push([
                            workout_id, 
                            idParaInsertar, 
                            index + 1, 
                            serie.repeticiones ?? 0, 
                            serie.peso ?? 0
                        ])
                    })
                }
            })

            if (values.length > 0) {
                await db.query(
                    'INSERT INTO workouts_exercises (workout_id, exercise_id, serie_num, repeticiones, peso) VALUES ?',
                    [values]
                )
            }
        }
        return workout_id
    },

    //Obtener workouts por usuario
    getWorkoutsByUser: async (user_id) => {
        //traemos los entrenamientos y el nombre de la rutina 
        const [workouts] = await db.query(`
            SELECT w.*, r.nombre as routine_nombre 
            FROM workouts w 
            LEFT JOIN routines r ON w.routine_id = r.id 
            WHERE w.user_id = ? 
            ORDER BY w.fecha DESC`, 
            [user_id]
        )

        if (workouts.length === 0) return []

        //traemos todos los ejercicios/series de esos workouts en 1 sola query
        const workoutIds = workouts.map(w => w.id)
        const [allSeries] = await db.query(`
            SELECT we.*, e.nombre as exercise_nombre 
            FROM workouts_exercises we 
            JOIN exercises e ON e.id = we.exercise_id 
            WHERE we.workout_id IN (?)`, 
            [workoutIds]
        )

        //Agrupamos las series dentro de cada workout correspondiente
        return workouts.map(w => ({
            ...w,
            exercises: allSeries.filter(s => s.workout_id === w.id)
        }))
    },

    //Obtener workout por ID
    getWorkoutById: async (workout_id, user_id) => {
        const [rows] = await db.query(`
            SELECT 
                w.id AS workout_id, w.fecha, w.feeling,
                r.id AS routine_id, r.nombre AS routine_nombre,
                e.id AS exercise_id, e.nombre AS exercise_nombre,
                we.serie_num, we.repeticiones, we.peso
            FROM workouts w
            LEFT JOIN routines r ON w.routine_id = r.id
            LEFT JOIN workouts_exercises we ON w.id = we.workout_id
            LEFT JOIN exercises e ON we.exercise_id = e.id
            WHERE w.id = ? AND w.user_id = ?
            ORDER BY we.exercise_id, we.serie_num
        `, [workout_id, user_id])

        return rows
    },

    //Actualizar workout
    updateWorkout: async (workout_id, {fecha, feeling, exercises}) => {
        //Actualizar datos
        await db.query(
            'UPDATE workouts SET fecha = ?, feeling = ? WHERE id = ?',
            [fecha, feeling, workout_id]
        )

        //Si se envían ejercicios, borramos los anteriores y ponemos los nuevos
        if (Array.isArray(exercises) && exercises.length > 0) {
            await db.query('DELETE FROM workouts_exercises WHERE workout_id = ?', [workout_id])

            const values = []
            exercises.forEach(ex => {
                const idParaInsertar = ex.exercise_id || ex.id
                if (idParaInsertar && Array.isArray(ex.series)) {
                    ex.series.forEach((serie, index) => {
                        values.push([
                            workout_id, 
                            idParaInsertar, 
                            index + 1, 
                            serie.repeticiones ?? 0, 
                            serie.peso ?? 0
                        ])
                    })
                }
            })

            if (values.length > 0) {
                await db.query(
                    'INSERT INTO workouts_exercises (workout_id, exercise_id, serie_num, repeticiones, peso) VALUES ?',
                    [values]
                )
            }
        }
        return workout_id
    },

    //Eliminar workout
    deleteWorkout: async (workout_id) => {
        const [result] = await db.query('DELETE FROM workouts WHERE id = ?', [workout_id])
        return result.affectedRows
    }
}

module.exports = Workout