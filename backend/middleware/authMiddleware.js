const jwt = require('jsonwebtoken')
const User = require('../models/usersModel')

const protect= async(req,res, next) => {
    
    //definir la variable token
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //Obtengo el token del encabezado de autorizacion
            token = req.headers.authorization.split(' ')[1]
            //Verifico el token con la firma del secreto
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            //buscar usuario con el id del token
            req.user =await User.findById(decoded.id).select('-password')

            next()
        
        }catch (error) {
            console.log(error)
            res.status(401)
            throw new Error('Acceso no autorizado')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Acceso no autorizado, no proporcionaste el token')
    }    
    
}

const generarToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}

module.exports = {protect, generarToken}