import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/user.schema'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  if (user_id) {
    const result = await userService.login(user_id.toString())
    return res.status(200).json({ message: 'User login successfully', result })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyReq>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // Should use try catch in  outermost function
  const result = await userService.createUser(req.body)
  return res.status(200).json({ message: 'User registered successfully', result })
}
