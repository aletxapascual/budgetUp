const express=require('express')
const router =express.Router()
const {getResumen,getEstadisticasMensuales,getGastosPorCategoria}=require('../controllers/estadisticasControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/resumen', protect, getResumen)
router.get('/mensuales', protect, getEstadisticasMensuales)
router.get('/categorias', protect, getGastosPorCategoria)

module.exports=router