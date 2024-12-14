import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import {
  ChangePasswordReqBody,
  FollowUserBodyReq,
  GetProfileUserBodyReq,
  LoginBodyRed,
  LogoutBodyReq,
  RegisterBodyReq,
  ResetPasswordBodyReq,
  TokenPayload,
  UnFollowUserBodyReq,
  UpdateMeBodyReq
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/user.schema'
import MESSAGES_ERROR from '~/constants/messages'
import dbService from '~/services/database.services'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { UserVerifyStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'

export const loginController = async (
  req: Request<ParamsDictionary, any, LoginBodyRed>,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  if (user_id) {
    const result = await userService.login({ user_id: user_id.toString(), verify: user.verify })
    res.status(200).json({ message: MESSAGES_ERROR.LOGIN_SUCCESS, result })
  }
}

export const oauthController = async (
  req: Request<ParamsDictionary, any, LoginBodyRed>,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.query
  const result = await userService.oauth(code as string)
  const urlRedirect = `${process.env.CLIENT_REDIRECT_URI_CALLBACK}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&verify=${result.verify}&new_user=${result.new_user}`
  return res.redirect(urlRedirect)
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyReq>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Should use try catch in  outermost function
  const result = await userService.createUser(req.body)
  res.status(200).json({ message: MESSAGES_ERROR.REGISTER_SUCCESS, result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  res.status(200).json({ message: MESSAGES_ERROR.LOGOUT_SUCCESS, result })
}

export const refreshToken = async (req: Request, res: Response) => {
  const decoded_refresh_token = req.decoded_refresh_token as TokenPayload
  const refresh_token = req.refresh_token
  const { user_id, verify } = decoded_refresh_token
  const result = await userService.refreshToken({
    user_id,
    refresh_token: refresh_token as string,
    verify
  })
  res.status(200).json({ message: MESSAGES_ERROR.REFRESH_TOKEN_SUCCESSFULLY, result })
}

export const verifyEmailController = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await dbService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES_ERROR.USER_NOT_FOUND })
  }
  // If verified email is response ok
  if (user.email_verify_token === '') {
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: MESSAGES_ERROR.EMAIL_VERIFY_ALREADY_VERIFIED })
  }
  // Else verify email
  const result = await userService.verifyEmail(user_id)
  res.status(200).json({ message: MESSAGES_ERROR.EMAIL_VERIFY_SUCCESSFULLY, result })
}

export const resendVerifyEmailController = async (
  req: Request,
  res: Response
): Promise<Response | any> => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const user = await dbService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES_ERROR.USER_NOT_FOUND })
  }

  // If verified email is response ok
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: MESSAGES_ERROR.EMAIL_VERIFY_ALREADY_VERIFIED
    })
  }

  // Else resend verify email
  const result = await userService.resendVerifyEmail(user_id)
  return res.status(200).json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { _id, verify } = req.user as User
  const result = await userService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  res.status(200).json(result)
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  res.status(200).json({ message: MESSAGES_ERROR.VERIFY_FORGOT_PASSWORD_SUCCESS })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordBodyReq>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body

  const result = await userService.resetPassword(user_id, password)
  res.status(200).json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload

  const result = await userService.getMe(user_id)
  res.status(200).json({
    message: MESSAGES_ERROR.GET_ME_SUCCESSFULLY,
    result
  })
}

export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeBodyReq>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  console.log(body)

  const result = await userService.updateMe(user_id, body)

  res.json({ message: MESSAGES_ERROR.UPDATE_ME_SUCCESS, result })
}

export const getProfileUserController = async (
  req: Request<GetProfileUserBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params

  const result = await userService.getProfileUser(username)

  if (result === null) {
    return next(
      new ErrorWithStatus({
        message: MESSAGES_ERROR.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    )
  }
  res.status(200).json({ message: MESSAGES_ERROR.GET_PROFILE_SUCCESS, result })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowUserBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body

  const result = await userService.followUser(user_id, followed_user_id)

  res.json(result)
}

export const unFollowController = async (
  req: Request<UnFollowUserBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params

  const result = await userService.unFollowUser(user_id, followed_user_id)

  res.json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body

  const result = await userService.changePassword(user_id, password)

  res.json(result)
}
