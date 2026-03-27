const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const routinesController = require('../controllers/routinesController')

router.post('/', auth, routinesController.createRoutineController)
router.get('/', auth, routinesController.getRoutinesController)

module.exports = router