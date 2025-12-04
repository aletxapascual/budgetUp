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

const updateGasto =asyncHandler(async(req,res)=>{
    const gasto = await Gasto.findById(req.params.id)
    if (!gasto){
        res.status(404)
        throw new Error('Gasto no existe')
    }

    //Verificamos que el gasto pertenece al usuario loggeado
    if(gasto.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        const gastoUpdated = await Gasto.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(gastoUpdated)
    }
        
})

const deleteGasto =asyncHandler( async(req,res)=>{
    const gasto = await Gasto.findById(req.params.id)
    if (!gasto){
        res.status(404)
        throw new Error('Gasto no existe')
    }

    //Verificamos que el gasto pertenece al usuario loggeado
    if(gasto.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        await gasto.deleteOne()
        res.status(200).json({id: req.params.id})
    }
})

module.exports={
    getGastos,
    createGasto,
    updateGasto,
    deleteGasto
}