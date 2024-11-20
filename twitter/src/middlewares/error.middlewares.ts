import { Request, Response, NextFunction } from 'express'
import omit from 'lodash/omit'
import HTTP_STATUS from '~/constants/httpStatusCode'

const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || HTTP_STATUS.SERVER_ERROR).json(omit(err, 'status'))
}

export default defaultErrorHandler
