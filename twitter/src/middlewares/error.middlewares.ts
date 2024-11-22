import { ErrorRequestHandler } from 'express'
import omit from 'lodash/omit'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { ErrorWithStatus } from '~/models/Errors'

const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, 'status'))
    return
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
