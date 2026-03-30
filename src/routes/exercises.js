const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {createExerciseController, getExercisesController, updateExerciseController, deleteExerciseController} = require('../controllers/exerciseController')

router.post('/', auth, createExerciseController)
router.get('/', auth, getExercisesController)
router.put('/', auth, updateExerciseController)
router.delete('/:id', auth, deleteExerciseController)

module.exports = router