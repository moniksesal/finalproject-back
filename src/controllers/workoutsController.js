const { createWorkout, getWorkoutsByUser, getWorkoutById, updateWorkout, deleteWorkout } = require('../models/Workout')

const createWorkoutController = async (req, res) => {
    try {
        const user_id = req.user.id
        const {routine_id, fecha, feeling, exercises} = req.body

        //validaciones
        if (!feeling || !exercises || exercises.length === 0) {
            return res.status(400).json({message: 'Faltan datos'})
        }

        const workoutId = await createWorkout(user_id, {routine_id, fecha, feeling, exercises})

        res.status(201).json({message: 'Tarea realizada con éxito'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error creando workout'})
    }
}

const getWorkoutsController = async (req, res) => {
    try {
        const user_id = req.user.id
        const workouts = await getWorkoutsByUser(user_id)
        res.json(workouts)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo workouts'})
    }
}

const getWorkoutByIdControler = async (req, res) => {
    try {
        const user_id = req.user.id
        const {id} = req.params
        const rows = await getWorkoutById(id, user_id)
        console.log(rows)

        if (rows.length === 0) {
            return res.status(404).json({message: 'Workout no encontrado'})
        }

        const workout = {
            id: rows[0].workout_id,
            fecha: rows[0].fecha,
            feeling: rows[0].feeling,
            routine: rows[0].routine_id ? {id: rows[0].routine_id, nombre: rows[0].routine_nombre} : null,
            exercises: []
        }

        const exercisesMap = {}

        rows.forEach(row => {
            if (!row.exercise_id) return

            if (!exercisesMap[row.exercise_id]) {
                exercisesMap[row.exercise_id] = {
                    id: row.exercise_id,
                    nombre: row.exercise_nombre,
                    series: []
                }
            }

            exercisesMap[row.exercise_id].series.push({
                reps: row.reps,
                peso: row.peso
            })
        })
        workout.exercises = Object.values(exercisesMap) //convierte las claves del objeto en un array de objetos

        res.json(workout)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error obteniendo workout"})
    }
}

const updateWorkoutController = async (req, res) => {
    try {
        const user_id = req.user.id
        const {id} = req.params
        const {fecha, feeling, exercises} = req.body

        //comprobar que el workout pertenece al usuario
        const [rows] = await getWorkoutById(id, user_id)
        if (rows.length === 0) return res.status(404).json({message: 'Workout no encontrado'})
        
        await updateWorkout(id, {fecha, feeling, exercises})
        res.json({message: 'Workout actualizado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error actualizando workout'})
    }
}

const deleteWorkoutController = async (req, res) => {
    try {
        const user_id = req.user.id
        const {id} = req.params

        //comprobar que el workout pertenece al usuario
        const [rows] = await getWorkoutById(id, user_id)
        if (!rows || rows.length === 0) return res.status(404).json({message: 'Workout no encontrado'})

        await deleteWorkout(id)
        res.json({message: 'Workout eliminado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error eliminando workout'})
    }
}

module.exports = {createWorkoutController, getWorkoutsController, getWorkoutByIdControler, updateWorkoutController, deleteWorkoutController}