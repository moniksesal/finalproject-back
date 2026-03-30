const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {getDashboardController} = require('../controllers/dashboardController')

router.get('/', auth, getDashboardController)

module.exports = router