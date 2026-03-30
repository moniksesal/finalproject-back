const Routine = require('../models/Routine')

const routinesController = {
    //crear una rutina y sus dias
    createRoutineController: async (req, res) => {
        try {
            const user_id = req.user.id //podemos usar req.user porque lo definimos en nuestro middleware y entonces ahora peude ser usado en todos los archivos
            const {nombre, dias} = req.body //dias=array de strings ["lunes", "miercoles"]

            //crear la rutina
            const routineId = await Routine.createRoutine({user_id, nombre})

            //añadir dias a la rutina
            if (Array.isArray(dias) && dias.length > 0) {
                await Routine.addRoutineDays({routine_id: routineId, user_id, dias})
            }

            res.json({message: 'Rutina creada correctamente', routineId})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Error creando rutina'})
        }
    },

    //obtener todas las rutinas del usuario
    getRoutinesController: async (req, res) => {
        try {
            const user_id = req.user.id
            const routines = await Routine.getRoutinesByUser(user_id)

            res.json(routines)
    } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Error obteniendo rutinas'})
        }
    },

    //obtener rutina por Id
    getRoutineByIdController: async (req, res) => {
        try {
            const { id } = req.params
            const routine = await Routine.getRoutineById(id)
            if (!routine) {
                return res.status(404).json({message: 'Rutina no encontrada'})
            }

            const dias = await Routine.getRoutineDays(id)

            res.json({...routine, dias})

        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Error obteniendo rutina'})
        }
    },

}

module.exports = routinesController