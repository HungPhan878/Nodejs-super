import { pick } from 'lodash'
import { Request, Response, NextFunction } from 'express'

// Use generic type to suggested parameters to pass
//Array<keyof T> create an array have keys of T and type of T
type FilterKeys<T> = Array<keyof T>

export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
