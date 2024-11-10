import { Request, Response, NextFunction } from 'express'

export const loginController = (req: Request, res: Response, next: NextFunction): any => {
  const { username, password } = req.body
  if (username === 'rich' && password === '789789') {
    return res.send('Hello World, Twitter! You have been logged in')
  } else {
    return res.status(500).json({ message: 'Login failed' })
  }
}
