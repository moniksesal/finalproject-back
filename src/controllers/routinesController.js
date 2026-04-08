const Routine = require('../models/Routine')

const routinesController = {
    //crear una rutina y sus dias
    createRoutineController: async (req, res) => {
        try {
            const user_id = req.user.id;
            const {nombre, dias} = req.body;

            const routineId = await Routine.createRoutine({user_id, nombre})

            //añadir los días a la tabla intermedia
            if (Array.isArray(dias) && dias.length > 0) {
                await Routine.addRoutineDays({routine_id: routineId, user_id, dias})
            }

            res.json({message: 'Rutina creada correctamente', routineId})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Error interno al crear la rutina'})
        }
    },

    //obtener todas las rutinas del user
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

    // obtener rutina por id
    getRoutineByIdController: async (req, res) => {
        try {
            const {id} = req.params
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

    //borrar rutina
    deleteRoutineController: async (req, res) => {
        try {
            const {id} = req.params
            const deleted = await Routine.deleteRoutine(id)
            if (!deleted) {
                return res.status(404).json({message: 'Rutina no encontrada'})
            }
            res.json({message: 'Rutina eliminada correctamente'})
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Error eliminando rutina'})
        }
    }
}

module.exports = routinesController