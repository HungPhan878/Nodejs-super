import { Request, Response, NextFunction } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction): any => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  } else {
    next()
  }
}
