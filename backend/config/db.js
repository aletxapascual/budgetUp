const mongoose = require('mongoose')

//Va a intentar conectarse a la base de datos
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.green.underline)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB