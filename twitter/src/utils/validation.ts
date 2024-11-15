import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const result = validationResult(req)
    if (result.isEmpty()) {
      return next()
    } else {
      // if errors are into here
      res.status(400).json({ errors: result.mapped() })
    }
  }
}
