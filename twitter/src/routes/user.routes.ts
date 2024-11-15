import { Router } from 'express'

// components
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController } from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)
userRouter.post('/register', registerValidator, registerController)

export default userRouter
