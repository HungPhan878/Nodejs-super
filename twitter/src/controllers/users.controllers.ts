import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { LogoutBodyReq, RegisterBodyReq } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/user.schema'
import MESSAGES_ERROR from '~/constants/messages'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  if (user_id) {
    const result = await userService.login(user_id.toString())
    return res.status(200).json({ message: MESSAGES_ERROR.LOGIN_SUCCESS, result })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyReq>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Should use try catch in  outermost function
  const result = await userService.createUser(req.body)
  return res.status(200).json({ message: MESSAGES_ERROR.REGISTER_SUCCESS, result })
}

export const logoutController = async (
  req: Request<ParamsDictionary, any, LogoutBodyReq>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await userService.logout(refresh_token)
  return res.status(200).json({ message: MESSAGES_ERROR.LOGOUT_SUCCESS, result })
}
