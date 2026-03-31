const getWeightProgress = require('../models/Progress')

const getProgressController = async (req, res) => {
    try {
        const user_id = req.user.id
        const weightProgress = await getWeightProgress(user_id)
        res.json({weightProgress})
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Error obteniendo progreso de peso'})
    }
}

module.exports = getProgressController