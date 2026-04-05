const Habit = require('../models/Habit')

//Obtener los hábitos
const getHabitsController = async (req, res) => {
    try {
        const user_id = req.user.id
        const habits = await Habit.getHabitsByUser(user_id)
        
        if (!habits) {
            return res.status(200).json({message: "No hay hábitos registrados", habits: null})
        }
        
        res.json(habits)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo hábitos'})
    }
}

//guardar habitos
const saveHabitsController = async (req, res) => {
    try {
        const user_id = req.user.id
        const { sueno, agua, tabaco, alcohol } = req.body

        if (sueno === undefined || agua === undefined) {
            return res.status(400).json({message: "Sueño y agua son campos obligatorios"})
        }

        const result = await Habit.upsertHabits(user_id, {sueno, agua, tabaco, alcohol})

        res.json({message: result.type === 'INSERT' ? 'Hábitos creados con éxito' : 'Hábitos actualizados correctamente', data: result})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error al procesar los hábitos'})
    }
}

module.exports = {getHabitsController, saveHabitsController}