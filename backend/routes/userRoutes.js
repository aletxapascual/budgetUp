const express = require('express')
const router = express.Router()
const {login, register, data, updateProfile} = require('../controllers/usersControllers')
const {protect}=require('../middleware/authMiddleware')

//endpoints publicos
router.post('/login', login)
router.post('/register', register)

//endpoints privados
router.get('/data', protect, data)
router.put('/profile', protect, updateProfile)

module.exports = router