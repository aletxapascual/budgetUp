const mongoose = require('mongoose')

const ingresoSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    monto: {
        type: Number,
        required: [true, "Por favor teclea el monto del ingreso"],
        min: [0, 'El monto no puede ser negativo']
    },
    fuente: {
        type: String,
        required: [true, "Por favor selecciona una fuente"],
        enum: ['Salario', 'Freelance', 'Negocio', 'Inversiones', 'Regalo', 'Bono', 'Otros']
    },
    descripcion: {
        type: String,
        required: [true, "Por favor teclea una descripción"]
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    esRecurrente: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports= mongoose.model('Ingreso', ingresoSchema)