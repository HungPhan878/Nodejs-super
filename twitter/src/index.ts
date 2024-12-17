// index.js hoặc app.js
import express from 'express'
import dbService from './services/database.services'
import defaultErrorHandler from './middlewares/error.middlewares'
import userRouter from './routes/user.routes'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'

config()

const app = express()
const port = process.env.PORT || 4000

dbService.connect()
// Create a uploads folder
initFolder()

// add middleware handlers for json
app.use(express.json())
// Gắn router user vào đường dẫn /users
app.use('/users', userRouter)
// Gắn router media vào đường dẫn /medias
app.use('/medias', mediaRouter)
// error handler
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
