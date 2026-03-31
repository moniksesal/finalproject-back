const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')

// Rutas de usuarios
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.get('/perfil', auth, (req, res) => {
    res.json({message: 'Ruta protegida, usuario logeado', user: req.user})
})

router.put('/plan', auth, userController.updatePlanController)

module.exports = router
