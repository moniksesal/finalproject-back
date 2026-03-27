const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res, next) => {
    try {
        // obtener header Authorization
        const authHeader = req.headers.authorization //para conseguir el token sin ponerlo directamente (seguridad)
        
        if (!authHeader) {
            return res.status(401).json({message: 'No autorizado'})
        }

        //formato "Bearer TOKEN"
        const token = authHeader.split(' ')[1] //divide el string y se queda con la segunda parte (el token)

        if (!token) {
            return res.status(401).json({message: 'Token inválido'})
        }

        //verificar token
        const verify = jwt.verify(token, process.env.JWT_SECRET) //usa el secret para comprobar la firma del token

        //guardo la info del usuario dentro de la req para que cualquier middleware pueda usarla
        req.user = verify

        next()
    } catch (error) {
        return res.status(401).json({message: 'Token no válido'})
    }
}

module.exports = auth