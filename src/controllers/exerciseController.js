const {createExercise, getExercises, updateExercise, deleteExercise} = require('../models/Exercise')
const db = require('../db')

// crear ejercicio
const createExerciseController = async (req, res) => {
    try {
        const user_id = req.user.id

        // comprobar plan
        const [[user]] = await db.query( // [[user]] es lo mismo que: const result = await db.query(...) // const user = result[0][0]
            `SELECT plan FROM users WHERE id = ?`,
            [user_id]
        )

        if (user.plan !== 'premium') {
            return res.status(403).json({message: 'Solo usuarios premium pueden crear ejercicios'}) //error 404: el servidor ha entendido la solicitud del usuario, pero niega el acceso al recurso solicitado
        }

        const exerciseId = await createExercise({
            user_id,
            ...req.body
        })

        res.json({message: 'Ejercicio creado', exerciseId})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error creando ejercicio'})
    }
}

// obtener ejercicios
const getExercisesController = async (req, res) => {
    try {
        const user_id = req.user.id
        const exercises = await getExercises(user_id)
        res.json(exercises)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo ejercicios'})
    }
}

//actualizar ejercicio personalizado
const updateExerciseController = async (req, res) => {
    try {
        const user_id = req.user.id
        const affectedRows = await updateExercise({user_id, ...req.body})
        if (affectedRows === 0) return res.status(404).json({message: 'Ejercicio no encontrado'})
        res.json({message: 'Ejercicio actualizado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error actualizando ejercicio'})
    }
}

//eliminar ejercicio personalizado
const deleteExerciseController = async (req, res) => {
    try {
        const user_id = req.user.id
        const {id} = req.params
        const affectedRows = await deleteExercise(id, user_id)
        if (affectedRows === 0) return res.status(404).json({message: 'Ejercicio no encontrado'})
        res.json({message: 'Ejercicio eliminado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error eliminando ejercicio'})
    }
}

module.exports = {createExerciseController, getExercisesController, updateExerciseController, deleteExerciseController}