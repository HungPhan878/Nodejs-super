// index.js hoặc app.js
import express from 'express'
import dbService from './services/database.services'
import userRouter from './routes/user.routes'
import defaultErrorHandler from './middlewares/error.middlewares'

const app = express()
const port = 3000

dbService.connect()

// add middleware handlers for json
app.use(express.json())
// Gắn router user vào đường dẫn /users
app.use('/users', userRouter)
// error handler
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
