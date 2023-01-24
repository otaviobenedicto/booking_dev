import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoute from './routes/auth.js'
import userRoute from './routes/users.js'
import roomsRoute from './routes/rooms.js'
import hotelsRoute from './routes/hotels.js'

import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'

const app = express()

app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(express.json())
dotenv.config()

const connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB iniciado!')
    } catch (error) {
        throw error
    }
}

mongoose.connection.on("disconnected", () => {
    console.log('mongoDB desconectado')
})

mongoose.connection.on("connected", () => {
    console.log('mongoDB conectado')
})


app.get("/", (req, res) => {
    res.send("Hello World!").status(200).json({ message: "Hello!!!" })
})

// middlewares

app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/hotel", hotelsRoute)
app.use("/api/room", roomsRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Erro! Por favor tente mais tarde!"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})

const PORT = process.env.PORT | 5000

app.listen(PORT, () => {
    connect()
    console.log("Servidor rodando na porta " + PORT)
})