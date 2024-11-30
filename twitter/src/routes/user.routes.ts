import { Router } from 'express'

// components
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import {
  verifyEmailController,
  loginController,
  logoutController,
  refreshToken,
  resendVerifyEmailController
} from '~/controllers/users.controllers'
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
 *  Description: Logout a user
 *  Path: /logout
 *  Method: POST
 * headers: { 'Authorization: Bearer <access_token>'}
 *  Body:{
 *       refresh_token:string
 *      }
 */
userRouter.post(
  '/logout',
  accessTokenValidator,
  refreshTokenValidator,
  wrapRequestHandler(logoutController)
)

/**
 *  Description: Create a new access token
 *  Path: /refresh_token
 *  Method: POST
 *  Body:{
 *       refresh_token:string
 *      }
 */
userRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshToken))

/**
 *  Description: Verify email address
 *  Path: /verify-email
 *  Method: POST
 *  Body:{
 *      email_verify_token:string
 *      }
 */
userRouter.post(
  '/verify-email',
  emailVerifyTokenValidator,
  wrapRequestHandler(verifyEmailController)
)

/**
 *  Description: Verify email address
 *  Path: /verify-email
 *  Method: POST
 *  Body:{
 *      email_verify_token:string
 *      }
 */
userRouter.post(
  '/resend-verify-email',
  accessTokenValidator,
  wrapRequestHandler(resendVerifyEmailController)
)

export default userRouter
