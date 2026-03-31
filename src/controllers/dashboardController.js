const {getLastWorkouts, getStats, getUserRoutines, getHabits, getObjective, getWorkoutStats} = require('../models/Dashboard')

const getDashboardController = async (req, res) => {
    try {
        const user_id = req.user.id

        const lastWorkouts = await getLastWorkouts(user_id)
        const stats = await getStats(user_id)
        const routines = await getUserRoutines(user_id)
        const habits = await getHabits(user_id)
        const objective = await getObjective(user_id)

        res.json({lastWorkouts, stats, routines, habits, objective})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo dashboard'})
    }
}

const getTipsController = async (req, res) => {
    try {
        const user_id = req.user.id
        const stats = await getWorkoutStats(user_id)
        const tips = []

        //tip 1: constancia
        if (stats.total < 2) {
            tips.push('Llevas pocos entrenamientos esta semana, intenta ser más constante.')
        } else if (stats.total >= 3) {
            tips.push('Buen trabajo, estás siendo constante')
        }

        // tip 2: feeling
        if (stats.avgFeeling !== null) {
            if (stats.avFeeling < 1.5) {
                tips.push('La rutina está siendo demasiado fácil para ti. ¡Sube un poco el peso o añade repeticiones!')
            } else if (stats.avFeeling > 2.5) {
                tips.push('La rutina está siendo muy exigente. Pon especial atención a tu técnica o ajusta series si hace falta.')
            } else {
                tips.push('Vas perfect@ con la intensidad actual. Sigue así.')
            }
        }
        // reespaldo por si no se cumple ninguna de las condiciones anteriores
        if (tips.length === 0) {
            tips.push('Sigue así, vas por buen camino 💪')
        }

        res.json({tips})

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error obteniendo tips' })
    }
}

module.exports = {getDashboardController, getTipsController}