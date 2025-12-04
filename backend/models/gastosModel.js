const mongoose = require('mongoose')

const gastoSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    monto: {
        type: Number,
        required: [true, "Por favor teclea el monto del gasto"],
        min: [0, 'El monto no puede ser negativo']
    },
    categoria: {
        type: String,
        required: [true, "Por favor selecciona una categoría"],
        enum: ['Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Servicios', 'Compras', 'Hogar', 'Otros']
    },
    descripcion: {
        type: String,
        required: [true, "Por favor teclea una descripción"]
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    metodoPago: {
        type: String,
        enum: ['Efectivo', 'Tarjeta', 'Transferencia', 'Otro'],
        default: 'Efectivo'
    },
    esRecurrente: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports= mongoose.model('Gasto', gastoSchema)