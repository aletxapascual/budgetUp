const asyncHandler = require('express-async-handler')
const Meta= require('../models/metasModel')
const User = require('../models/usersModel')

const getMetas =asyncHandler( async(req,res)=>{
    const metas = await Meta.find({user : req.user.id}).sort({fechaLimite: 1})
    res.status(200).json(metas)
})

const createMeta =asyncHandler( async(req,res)=>{
    if(!req.body.nombre || !req.body.montoObjetivo || !req.body.fechaLimite){
        res.status(400)
        throw new Error('Por favor llena todos los campos requeridos')
    }

    const meta = await Meta.create({
        nombre: req.body.nombre,
        montoObjetivo: req.body.montoObjetivo,
        fechaLimite: req.body.fechaLimite,
        categoria: req.body.categoria || 'Otros',
        descripcion: req.body.descripcion || '',
        prioridad: req.body.prioridad || 'Media',
        user: req.user.id
    })

    //Dar puntos al usuario
    const user = await User.findById(req.user.id)
    user.puntos += 20
    user.ultimaActividad = Date.now()
    await user.save()

    res.status(201).json(meta)
})

module.exports={
    getMetas,
    createMeta
}