const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
//llamar variable de entorno
const port = process.env.PORT || 5000
const connectDB = require('./config/db')
const {errorHandler} = require('./middleware/errorMiddleware')
const cors= require('cors')

connectDB()

//express es el framework para hacer backend en javascript
const app = express()
app.use(cors())

//es el que arranca
app.listen(port, ()=> console.log(`Servidor iniciado en el puerto ${port}`))

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use('/api/users',require('./routes/userRoutes'))
app.use('/api/gastos',require('./routes/gastosRoutes'))
app.use('/api/ingresos',require('./routes/ingresosRoutes'))
app.use('/api/metas',require('./routes/metasRoutes'))
app.use('/api/estadisticas',require('./routes/estadisticasRoutes'))

app.use(errorHandler)