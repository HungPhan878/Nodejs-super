import { Request, Response, NextFunction } from 'express'
import omit from 'lodash/omit'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { ErrorWithStatus } from '~/models/Errors'

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): any => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, 'status'))
  }

  // Return an error when progress logic on server throw errors
  const descriptions = Object.getOwnPropertyDescriptors(err)

  // Use for to loop over objects
  for (const key in descriptions) {
    descriptions[key].enumerable = true
  }
  Object.defineProperties(err, descriptions)

  res
    .status(HTTP_STATUS.SERVER_ERROR)
    .json({ message: err.message, error_info: omit(err, 'status', 'stack') })
}

export default defaultErrorHandler
