const {getLastWorkouts, getStats, getUserRoutines, getHabits, getObjective} = require('../models/Dashboard')

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

module.exports = { getDashboardController }