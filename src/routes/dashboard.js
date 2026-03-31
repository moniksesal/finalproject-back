const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {getDashboardController, getTipsController} = require('../controllers/dashboardController')

router.get('/', auth, getDashboardController)
router.get ('/tips', auth, getTipsController)

module.exports = router