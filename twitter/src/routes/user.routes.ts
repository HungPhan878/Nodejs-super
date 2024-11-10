import { Router } from 'express'

// components
import { loginValidator } from '~/middlewares/login.middlewares'
import { loginController } from '~/controllers/users.controllers'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)

export default userRouter
