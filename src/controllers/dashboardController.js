const {getLastWorkouts, getStats, getUserRoutines, getHabits, getObjective, getWorkoutStats} = require('../models/Dashboard');

const getDashboardData = async (req, res) => {
    try {
        const user_id = req.user.id;
        const user_nombre = req.user.nombre;

        const [lastWorkouts, stats, routines, habits, objective, recentStats] = await Promise.all([ //hace varias promesas a la vez
            getLastWorkouts(user_id, 1), //solo el ultimo workout
            getStats(user_id),
            getUserRoutines(user_id),
            getHabits(user_id),
            getObjective(user_id),
            getWorkoutStats(user_id)
        ])

        //mensajes inteligentes
        let smartMessage = `¡Hola! ¿List@ para superar tus marcas hoy?`
        let tipType = 'info' //lo usamos luego para el front

        if (habits) {
            if (habits.sueno < 6) {
                smartMessage = "Has dormido menos de 6h. El riesgo de lesión aumenta, entrena con cargas moderadas."
                tipType = 'warning'
            } else if (habits.agua === 'baja') {
                smartMessage = "Tu hidratación es baja. Beber agua durante el entreno evitará calambres."
                tipType = 'warning'
            }
        }

        //feedback de los ultimos 7dias
        let workoutFeedback = null
        if (recentStats && recentStats.total > 0) {
            if (recentStats.avgFeeling < 1.5) { //facil
                workoutFeedback = `🔥 Promedio de la semana: ¡Muy fácil! Es hora de subir los pesos gradualmente.`
            } else if (recentStats.avgFeeling > 2.5) { //dificil promedio
                workoutFeedback = `🧊 Semana intensa. Asegúrate de descansar 48h entre grupos musculares.`
            }
        }

        res.json({
            user_info: {
                nombre: user_nombre,
                objetivo: objective ? objective.name : 'Sin objetivo definido'
            },
            summary: {
                total_rutinas: routines.length,
                total_ejercicios_realizados: stats.totalExercises,
                feeling_stats: stats.feelingStats,
                ultimo_entreno: lastWorkouts[0] || null
            },
            coach: {
                message: smartMessage,
                type: tipType,
                suggestion: workoutFeedback,
                empty_state: routines.length === 0
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Error al cargar los datos del dashboard"})
    }
}

module.exports = {getDashboardData}