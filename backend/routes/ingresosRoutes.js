const express=require('express')
const router =express.Router()
const {getIngresos,createIngreso,updateIngreso,deleteIngreso}=require('../controllers/ingresosControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getIngresos)
router.post('/', protect, createIngreso)

module.exports=router