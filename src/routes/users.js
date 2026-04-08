const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.get('/profile', auth, userController.getProfile)

router.put('/update-plan', auth, userController.updatePlanController)
router.put('/downgrade', auth, userController.switchToFree)

module.exports = router
