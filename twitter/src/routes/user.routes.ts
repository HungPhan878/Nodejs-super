import { Router } from 'express'

// components
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController } from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const userRouter = Router()

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body:{
 *      email: string,
 *      password: string
 *      }
 * */
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body:{
 *    confirm-password: string (required),
 *    password: string (required),
 *    email: string ,
 *    name: string ,
 *    day of birth: string ,
 * }
 */
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 *  Description: Logout an user
 *  Path: /logout
 *  Method: POST
 *  Body:{
 *       refresh_token:string
 *      }
 */
userRouter.post('/logout', registerValidator, wrapRequestHandler(registerController))

export default userRouter
