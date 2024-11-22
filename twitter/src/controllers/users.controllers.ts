import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req
  const user_id = user._id
  throw Error('Error!')
  if (user_id) {
    const result = await userService.login(user_id)
    return res.status(200).json({ message: 'User login successfully', result })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterBodyReq>,
  res: Response
): Promise<any> => {
  // Should use try catch in  outermost function
  const result = await userService.createUser(req.body)
  return res.status(200).json({ message: 'User registered successfully', result })
}
