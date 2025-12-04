const express=require('express')
const router =express.Router()
const {getMetas,createMeta,updateMeta,agregarMonto,deleteMeta}=require('../controllers/metasControllers')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getMetas)
router.post('/', protect, createMeta)


module.exports=router