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
    presupuestoMensual: {
        type: Number,
        default: 0
    },
    moneda: {
        type: String,
        default: 'MXN'
    },
    esPremium: {
        type: Boolean,
        default: false
    },
    puntos: {
        type: Number,
        default: 0
    },
    nivel: {
        type: Number,
        default: 1
    },
    racha: {
        type: Number,
        default: 0
    },
    ultimaActividad: {
        type: Date,
        default: Date.now
    },
    insignias: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)