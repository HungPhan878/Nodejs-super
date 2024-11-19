import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import userService from '~/services/users.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'

export const loginController = (req: Request, res: Response, next: NextFunction): any => {
  const { username, password } = req.body
  if (username === 'rich' && password === '789789') {
    return res.send('Hello World, Twitter! You have been logged in')
  } else {
    return res.status(500).json({ message: 'Login failed' })
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
