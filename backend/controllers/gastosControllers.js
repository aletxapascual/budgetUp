const asyncHandler = require('express-async-handler')
const Gasto= require('../models/gastosModel')
const User = require('../models/usersModel')

const getGastos =asyncHandler( async(req,res)=>{
    const gastos = await Gasto.find({user : req.user.id}).sort({fecha: -1})
    res.status(200).json(gastos)
})

const createGasto =asyncHandler( async(req,res)=>{
    if(!req.body.monto || !req.body.categoria || !req.body.descripcion){
        res.status(400)
        throw new Error('Por favor llena todos los campos requeridos')
    }

    const gasto = await Gasto.create({
        monto: req.body.monto,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha || Date.now(),
        metodoPago: req.body.metodoPago || 'Efectivo',
        esRecurrente: req.body.esRecurrente || false,
        user: req.user.id
    })

    //Dar puntos al usuario
    const user = await User.findById(req.user.id)
    user.puntos += 10
    user.ultimaActividad = Date.now()
    await user.save()

    res.status(201).json(gasto)
})

module.exports={
    getGastos,
    createGasto
}