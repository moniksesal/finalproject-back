const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const routinesController = require('../controllers/routinesController')
const addExercisesController = require('../controllers/routineExerciseController')

router.post('/', auth, routinesController.createRoutineController)
router.get('/', auth, routinesController.getRoutinesController)

router.post('/exercises', auth, addExercisesController)
router.get('/:id', auth, routinesController.getRoutineByIdController)

module.exports = router