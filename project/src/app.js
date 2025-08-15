import express from 'express'
import  cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()


app.use(express.json({limit: "10kb"}))
app.use(express.urlencoded({extended:true,limit: "10kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//router import
import uesrRouter from './routes/user.routes.js'

app.use("/api/v1/users", uesrRouter)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

export {app}