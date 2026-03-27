const { createHabit, getHabitsByUser, updateHabit } = require('../models/Habit')

//crear hábito
const createHabitController = async (req, res) => {
    try {
        const user_id = req.user.id
        const habitId = await createHabit({user_id, ...req.body})
        res.json({message: 'Hábito creado', habitId})
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error creando hábito' })
    }
}

// obtener hábitos del usuario
const getHabitsController = async (req, res) => {
    try {
        const user_id = req.user.id
        const habits = await getHabitsByUser(user_id)
        res.json(habits)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo hábitos'})
    }
}

//actualizar hábito
const updateHabitController = async (req, res) => {
    try {
        const user_id = req.user.id;
        const affectedRows = await updateHabit({ user_id, ...req.body })
        if (affectedRows === 0) {
            return res.status(404).json({message: 'Hábito no encontrado'})
        }
        res.json({message: 'Hábito actualizado'})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error actualizando hábito'})
    }
}

module.exports = {createHabitController, getHabitsController, updateHabitController}