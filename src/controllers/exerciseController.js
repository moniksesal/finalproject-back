const {createExercise, getExercises, updateExercise, deleteExercise} = require('../models/Exercise')
const db = require('../db')

// crear ejercicio
const createExerciseController = async (req, res) => {
    try {
        const user_id = req.user.id; // Esto viene del token

        //buscar plan real y actualizado en la base de datos
        const [rows] = await db.query('SELECT plan FROM users WHERE id = ?', [user_id])
        
        if (rows.length === 0) {
            return res.status(404).json({message: 'Usuario no encontrado'})
        }

        const userActualizado = rows[0]

        //comprobamos el plan
        if (userActualizado.plan !== 'premium') {
            return res.status(403).json({message: 'Solo usuarios premium pueden crear ejercicios'})
        }

        //si es premium... 
        const { nombre, descripcion, imagen_url, video_url } = req.body

        const exerciseId = await createExercise({
            nombre,
            descripcion,
            imagen_url,
            video_url,
            user_id
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
        const {id} = req.params
        const affectedRows = await updateExercise({id, user_id, ...req.body})
        if (affectedRows === 0) return res.status(404).json({message: 'Ejercicio no encontrado o no autorizado'})
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