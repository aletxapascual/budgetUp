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

const updateMeta =asyncHandler(async(req,res)=>{
    const meta = await Meta.findById(req.params.id)
    if (!meta){
        res.status(404)
        throw new Error('Meta no existe')
    }

    //Verificamos que la meta pertenece al usuario loggeado
    if(meta.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        const metaUpdated = await Meta.findByIdAndUpdate(req.params.id, req.body, {new:true})
        
        //Si se completó la meta, dar bonus de puntos
        if(req.body.estado === 'Completada' && metaUpdated.estado === 'Completada'){
            const user = await User.findById(req.user.id)
            user.puntos += 100
            user.insignias.push('Meta Completada')
            await user.save()
        }
        
        res.status(200).json(metaUpdated)
    }
        
})

const agregarMonto =asyncHandler(async(req,res)=>{
    const meta = await Meta.findById(req.params.id)
    if (!meta){
        res.status(404)
        throw new Error('Meta no existe')
    }

    //Verificamos que la meta pertenece al usuario loggeado
    if(meta.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    }

    if(!req.body.monto || req.body.monto <= 0){
        res.status(400)
        throw new Error('Monto inválido')
    }

    meta.montoActual += req.body.monto

    //Verificar si se completó la meta
    if(meta.montoActual >= meta.montoObjetivo && meta.estado === 'Activa'){
        meta.estado = 'Completada'
        
        const user = await User.findById(req.user.id)
        user.puntos += 100
        user.insignias.push('Meta Completada')
        await user.save()
    }

    await meta.save()
    res.status(200).json(meta)
})

const deleteMeta =asyncHandler( async(req,res)=>{
    const meta = await Meta.findById(req.params.id)
    if (!meta){
        res.status(404)
        throw new Error('Meta no existe')
    }

    //Verificamos que la meta pertenece al usuario loggeado
    if(meta.user.toString()!== req.user.id) {
        res.status(401)
        throw new Error ('Usuario no autorizado')
    } else {
        await meta.deleteOne()
        res.status(200).json({id: req.params.id})
    }
})

module.exports={
    getMetas,
    createMeta,
    updateMeta,
    agregarMonto,
    deleteMeta
}