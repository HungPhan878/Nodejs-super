import { Router } from 'express'

// components
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import {
  verifyEmailController,
  loginController,
  logoutController,
  refreshToken,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordTokenController,
  resetPasswordController
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

/**
 *  Description: Reset password
 *  Path: /forgot-password
 *  Method: POST
 *  Body:{
 *      email:string
 *      }
 */
userRouter.post(
  '/forgot-password',
  forgotPasswordValidator,
  wrapRequestHandler(forgotPasswordController)
)

/**
 *  Description: verify forgot password token
 *  Path: /verify-forgot-password
 *  Method: POST
 *  Body:{
 *      forgot_password_token:string
 *      }
 */
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 *  Description: Reset password again and response message for client
 *  Path: /reset-password
 *  Method: POST
 *  Body:{
 *      forgot_password_token:string,
 *      password:string,
 *      confirm_password:string
 *      }
 */
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  wrapRequestHandler(resetPasswordController)
)

export default userRouter
