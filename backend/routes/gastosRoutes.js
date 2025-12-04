const express=require('express')
const router =express.Router()
const {getGastos,createGasto,updateGasto,deleteGasto}=require('../controllers/gastosControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getGastos)
router.post('/', protect, createGasto)


module.exports=router