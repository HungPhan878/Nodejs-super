import { Router } from 'express'

const userRouter = Router()

userRouter.use((req, res, next) => {
  console.log('Middlware 1')
  next()
})

userRouter.get('/tweet', (req, res) => {
  res.send('Hello World, Twitter!')
})

export default userRouter
