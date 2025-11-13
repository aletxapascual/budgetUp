const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    nombre: {
        type:String,
        required : [true, 'Por favor teclea tu nombre']
    },
    email: {
        type:String,
        required : [true, 'Por favor teclea tu email'],
        unique: true
    },
    password: {
        type:String,
        required : [true, 'Por favor teclea tu contraseña']
    },
    esAdmin: {
        type:Boolean,
        default: false
    }

})

module.exports = mongoose.model('User', userSchema)