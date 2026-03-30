const {getObjectives, updateUserObjective, getUserObjective} = require('../models/Objective')

//Listar todos los objetivos
const getObjectivesController = async (req, res) => {
    try {
        const objectives = await getObjectives()
        res.json(objectives)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message:'Error obteniendo objetivos'})
    }
}

//Actualizar objetivo de un usuario
const updateObjectiveController = async (req, res) => {
    try {
        const user_id = req.user.id
        const {objective_id} = req.body

        const affectedRows = await updateUserObjective(user_id, objective_id)
        if (affectedRows === 0) {
            return res.status(404).json({message: 'Usuario no encontrado o objetivo inválido'})
        }

        res.json({message: 'Objetivo actualizado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error actualizando objetivo'})
    }
}

//devolver el obj del user
const getUserObjectiveController = async (req, res) => {
    try {
        const user_id = req.user.id
        const objective = await getUserObjective(user_id)
        if (!objective) return res.json({message: 'Usuario sin objetivo'})
        res.json(objective)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo objetivo del usuario'})
    }
}

module.exports = {getObjectivesController, updateObjectiveController, getUserObjectiveController}