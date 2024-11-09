// index.js hoặc app.js
import express from 'express'
import userRouter from './user.routes'

const app = express()
const port = 3000

// Gắn router user vào đường dẫn /users
app.use('/users', userRouter)

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
