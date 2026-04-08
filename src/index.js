const express = require('express')
const cors = require('cors')
const usersRouter = require('./routes/users')
const habitsRouter = require('./routes/habits')
const routinesRouter = require('./routes/routines')
const workoutsRouter = require('./routes/workouts')
const objectivesRouter = require('./routes/objectives')
const exercisesRouter = require('./routes/exercises')
const dashboardRouter = require('./routes/dashboard')
const progressRouter = require('./routes/progress')


require('dotenv').config()

const app = express()

//Middlewares
app.use(cors())
app.use(express.json())

app.use('/users', usersRouter)
app.use('/habits', habitsRouter)
app.use('/routines', routinesRouter)
app.use('/workouts', workoutsRouter)
app.use('/objectives', objectivesRouter)
app.use('/exercises', exercisesRouter)
app.use('/dashboard', dashboardRouter)
app.use('/progress', progressRouter)

app.post('/register', usersRouter)
app.post('/login', usersRouter)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})