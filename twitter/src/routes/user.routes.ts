import { Router } from 'express'

// components
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController } from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default userRouter
