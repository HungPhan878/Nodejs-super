import { ErrorRequestHandler } from 'express'
import omit from 'lodash/omit'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { ErrorWithStatus } from '~/models/Errors'

const defaultErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  try {
    if (err instanceof ErrorWithStatus) {
      res.status(err.status).json(omit(err, 'status'))
      return
    }

    // Return an error when progress logic on server throw errors
    const finalError: any = {}
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (
        !Object.getOwnPropertyDescriptor(err, key)?.configurable ||
        !Object.getOwnPropertyDescriptor(err, key)?.writable
      ) {
        return
      }
      finalError[key] = err[key]
    })
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: err.message, error_info: omit(err, 'status', 'stack') })
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: 'Internal server error', error_info: omit(error as any, 'status', 'stack') })
  }
}

export default defaultErrorHandler
