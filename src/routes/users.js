const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Rutas de usuarios
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

// GET para test
router.get('/', (req, res) => {
    res.json({ message: 'Lista de usuarios (ruta de prueba)' });
})

module.exports = router
