const asyncHandler = require('express-async-handler')
const Ingreso= require('../models/ingresosModel')
const User = require('../models/usersModel')

const getIngresos =asyncHandler( async(req,res)=>{
    const ingresos = await Ingreso.find({user : req.user.id}).sort({fecha: -1})
    res.status(200).json(ingresos)
})

const createIngreso =asyncHandler( async(req,res)=>{
    if(!req.body.monto || !req.body.fuente || !req.body.descripcion){
        res.status(400)
        throw new Error('Por favor llena todos los campos requeridos')
    }

    const ingreso = await Ingreso.create({
        monto: req.body.monto,
        fuente: req.body.fuente,
        descripcion: req.body.descripcion,
        fecha: req.body.fecha || Date.now(),
        esRecurrente: req.body.esRecurrente || false,
        user: req.user.id
    })

    //Dar puntos al usuario
    const user = await User.findById(req.user.id)
    user.puntos += 15
    user.ultimaActividad = Date.now()
    await user.save()

    res.status(201).json(ingreso)
})

const updateIngreso =asyncHandler(async(req,res)=>{
    const ingreso = await Ingreso.findById(req.params.id)
    if (!ingreso){
        res.status(404)
        throw new Error('Ingreso no existe')
    }

    //Verificamos que el ingreso pertenece al usuario loggeado
    if(ingreso.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        const ingresoUpdated = await Ingreso.findByIdAndUpdate(req.params.id, req.body, {new:true})
        res.status(200).json(ingresoUpdated)
    }
        
})

const deleteIngreso =asyncHandler( async(req,res)=>{
    const ingreso = await Ingreso.findById(req.params.id)
    if (!ingreso){
        res.status(404)
        throw new Error('Ingreso no existe')
    }

    //Verificamos que el ingreso pertenece al usuario loggeado
    if(ingreso.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        await ingreso.deleteOne()
        res.status(200).json({id: req.params.id})
    }
})

module.exports={
    getIngresos,
    createIngreso,
    updateIngreso,
    deleteIngreso
}