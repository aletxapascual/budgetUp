const asyncHandler = require('express-async-handler')
const Gasto = require('../models/gastosModel')
const Ingreso = require('../models/ingresosModel')
const Meta = require('../models/metasModel')

const getResumen = asyncHandler(async(req,res) => {
    const userId = req.user.id

    //Obtener gastos totales
    const gastos = await Gasto.find({user: userId})
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

    //Obtener ingresos totales
    const ingresos = await Ingreso.find({user: userId})
    const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0)

    //Calcular balance
    const balance = totalIngresos - totalGastos

    //Obtener metas
    const metas = await Meta.find({user: userId})
    const metasActivas = metas.filter(m => m.estado === 'Activa').length
    const metasCompletadas = metas.filter(m => m.estado === 'Completada').length

    res.status(200).json({
        totalIngresos,
        totalGastos,
        balance,
        metas: {
            total: metas.length,
            activas: metasActivas,
            completadas: metasCompletadas
        },
        transacciones: {
            gastos: gastos.length,
            ingresos: ingresos.length
        }
    })
})

const getEstadisticasMensuales = asyncHandler(async(req,res) => {
    const userId = req.user.id
    const {anio, mes} = req.query

    const fechaActual = new Date()
    const anioTarget = anio ? parseInt(anio) : fechaActual.getFullYear()
    const mesTarget = mes ? parseInt(mes) : fechaActual.getMonth() + 1

    const fechaInicio = new Date(anioTarget, mesTarget - 1, 1)
    const fechaFin = new Date(anioTarget, mesTarget, 0, 23, 59, 59)

    //Obtener gastos del mes
    const gastos = await Gasto.find({
        user: userId,
        fecha: {$gte: fechaInicio, $lte: fechaFin}
    })
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

    //Obtener ingresos del mes
    const ingresos = await Ingreso.find({
        user: userId,
        fecha: {$gte: fechaInicio, $lte: fechaFin}
    })
    const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0)

    const balanceMensual = totalIngresos - totalGastos

    res.status(200).json({
        anio: anioTarget,
        mes: mesTarget,
        totalIngresos,
        totalGastos,
        balanceMensual,
        transacciones: {
            gastos: gastos.length,
            ingresos: ingresos.length
        }
    })
})

const getGastosPorCategoria = asyncHandler(async(req,res) => {
    const userId = req.user.id

    const gastos = await Gasto.find({user: userId})

    //Agrupar por categoría
    const categorias = {}
    gastos.forEach(gasto => {
        const cat = gasto.categoria
        if(!categorias[cat]){
            categorias[cat] = {
                categoria: cat,
                total: 0,
                count: 0
            }
        }
        categorias[cat].total += gasto.monto
        categorias[cat].count += 1
    })

    const totalGeneral = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

    //Calcular porcentajes
    const resultado = Object.values(categorias).map(cat => ({
        ...cat,
        porcentaje: totalGeneral > 0 ? ((cat.total / totalGeneral) * 100).toFixed(2) : 0
    }))

    //Ordenar por total descendente
    resultado.sort((a, b) => b.total - a.total)

    res.status(200).json({
        totalGeneral,
        categorias: resultado
    })
})

module.exports = {
    getResumen,
    getEstadisticasMensuales,
    getGastosPorCategoria
}