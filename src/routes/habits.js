const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { createHabitController, getHabitsController, updateHabitController } = require('../controllers/habitsController')

//crear hábito
router.post('/', auth, createHabitController)

//obtener hábitos del user
router.get('/', auth, getHabitsController)

//actualizar hábito
router.put('/', auth, updateHabitController)

module.exports = router