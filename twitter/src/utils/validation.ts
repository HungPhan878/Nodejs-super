import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const error = validationResult(req)
    const errorObjects = error.mapped()
    for (const key in errorObjects) {
      const { msg } = errorObjects[key]
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
    }
    if (error.isEmpty()) {
      return next()
    } else {
      // if errors are into here
      res.status(400).json({ errors: error.mapped() })
    }
  }
}
