const mongoose = require('mongoose')

const metaSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nombre: {
        type: String,
        required: [true, "Por favor teclea el nombre de la meta"]
    },
    montoObjetivo: {
        type: Number,
        required: [true, "Por favor teclea el monto objetivo"],
        min: [0, 'El monto no puede ser negativo']
    },
    montoActual: {
        type: Number,
        default: 0,
        min: [0, 'El monto actual no puede ser negativo']
    },
    fechaLimite: {
        type: Date,
        required: [true, "Por favor selecciona una fecha límite"]
    },
    categoria: {
        type: String,
        enum: ['Viaje', 'Emergencia', 'Compra', 'Deuda', 'Educación', 'Inversión', 'Otros'],
        default: 'Otros'
    },
    descripcion: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Activa', 'Completada', 'Cancelada'],
        default: 'Activa'
    },
    prioridad: {
        type: String,
        enum: ['Alta', 'Media', 'Baja'],
        default: 'Media'
    }
}, {
    timestamps: true
})

module.exports= mongoose.model('Meta', metaSchema)