import { Router } from 'express'

// components
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followerValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
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
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileUserController,
  followController
} from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeBodyReq } from '~/models/requests/User.requests'

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

/**
 *  Description: Get my profile
 *  Path: /me
 *  Method: GET
 *  headers:{ 'Authorization: Bearer <access_token>'}
 */
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 *  Description: Update my profile
 *  Path: /me
 *  Method: PATCH
 *  headers:{ 'Authorization: Bearer <access_token>'}
 * body: UserSchema
 */
userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeBodyReq>([
    'name',
    'avatar',
    'bio',
    'cover_photo',
    'date_of_birth',
    'location',
    'username',
    'website'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 *  Description: Get profile user
 *  Path: /:username
 *  Method: GET
 */
userRouter.get('/:username', wrapRequestHandler(getProfileUserController))

/**
 *  Description: follow someone
 *  Path: /follow
 *  Method: POST
 * headers: { 'Authorization: Bearer <access_token>'}
 * body: {
 * followed_user_id: string
 * }
 */
userRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followerValidator,
  wrapRequestHandler(followController)
)

export default userRouter
