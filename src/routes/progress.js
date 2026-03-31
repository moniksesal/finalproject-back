const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const getProgressController = require('../controllers/progressController')

router.get('/', auth, getProgressController)

module.exports = router