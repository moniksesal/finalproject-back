const Routine = require('../models/Routine')
const addExerciseToRoutine = require('../models/RoutineExercise')

const addExercisesController = async (req, res) => {
    try {
        const {routine_id, exercises} = req.body
        await addExerciseToRoutine(routine_id, exercises)
        res.json({message: 'Ejercicios añadidos a la rutina'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error añadiendo ejercicios'})
    }
}

module.exports = addExercisesController