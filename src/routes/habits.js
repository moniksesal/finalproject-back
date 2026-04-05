const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const habitController = require('../controllers/habitsController')

router.get('/', auth, habitController.getHabitsController)

router.post('/', auth, habitController.saveHabitsController)

module.exports = router