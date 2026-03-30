const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {getObjectivesController, updateObjectiveController, getUserObjectiveController} = require('../controllers/objectiveController')

router.get('/', auth, getObjectivesController)

router.put('/', auth, updateObjectiveController)

router.get('/user', auth, getUserObjectiveController)

module.exports = router