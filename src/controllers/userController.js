const jwt = require('jsonwebtoken')
const db = require('../db')
const User = require('../models/User')
require('dotenv').config()

//JWT: generar y verificar TOKENS. Lo usaremos para el login
const generateToken = (user) => {
    return jwt.sign(
        {id: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '20d'}
    )
}

const userController = {
    // registro de usuario
    registerUser: async (req, res) => {
        try {
            // Mantenemos solo tus campos originales
            const {nombre, email, password, edad, objective_id, plan} = req.body

            //comprobamos si ya existe
            const existingUser = await User.findByEmail(email)
            if (existingUser) {
                return res.status(400).json({message: `El email ${email} ya está registrado`})
            }

            //crear usuario
            const user = await User.create({nombre, email, password, edad, objective_id, plan})

            //generar token
            const token = generateToken(user)
            
            // Devolvemos el usuario creado (que incluye el nombre) y el token
            res.status(201).json({user, token})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: 'Error al registrar el usuario'})
        }
    },

    //login de usuario
    loginUser: async (req, res) => {
        try {
            const {email, password} = req.body

            const user = await User.findByEmail(email)
            if (!user) {
                return res.status(400).json({message: 'Email o contraseña incorrectos'})
            }

            const isMatch = await User.comparePassword(password, user.password) //compara la password que ha puesto el user y la hasheada
            if (!isMatch) {
                return res.status(400).json({message: 'Contraseña incorrecta'})
            }

            const token = generateToken(user)

            const userWithoutPassword = {...user}
            delete userWithoutPassword.password //quita password del objeto user para no enviar la contraseña al frontend

            res.json({user: userWithoutPassword, token})
        } catch (error) {
            console.error(error)
            res.status(500).json({message:'Error al iniciar sesión'})
        }
    },

    //actualizar plan
    updatePlanController: async (req, res) => {
        try {
            const user_id = req.user.id
            const {plan} = req.body

            if (!['free', 'premium'].includes(plan)) {
                return res.status(400).json({message: 'Plan no válido'})
            }

            await db.query('UPDATE users SET plan = ? WHERE id = ?', [plan, user_id])

            res.json({message: `Plan actualizado a ${plan}`})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Error actualizando plan"})
        }
    },

    //obtener perfil
    getProfile: getProfile = async (req, res) => {
        try {
            //El ID viene del token decodificado en el middleware 'auth'
            const userId = req.user.id

            const user = await User.findById(userId)

            if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
            }

            res.json(user)
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Error al obtener los datos del perfil"})
        }
    }
}

module.exports = userController

/*
Registro con token: 
Registro -> token -> ya estás dentro

Registro sin token:
Registro -> ok -> ahora haz login (mala experiencia de usuario)

-Mantiene la sesión sin guardar nada en el servidor
-Autoriza rutas privadas
-Duración limitada (seguridad extra)
*/