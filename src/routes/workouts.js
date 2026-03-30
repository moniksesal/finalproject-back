const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {createWorkoutController, getWorkoutsController, getWorkoutByIdControler, updateWorkoutController, deleteWorkoutController} = require('../controllers/workoutsController')

//crear
router.post('/', auth, createWorkoutController)

//listar todos
router.get('/', auth, getWorkoutsController) 

//obtener uno por id
router.get('/:id', auth, getWorkoutByIdControler)

//actualizar por id
router.put('/:id', auth, updateWorkoutController)

//borrar por id
router.delete('/:id', auth, deleteWorkoutController)


module.exports = router