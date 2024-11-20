import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import MESSAGES_ERROR from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import userService from '~/services/users.services'

// components
import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction): any => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' })
  } else {
    next()
  }
}

export const registerValidator = validate(
  checkSchema({
    email: {
      isEmail: {
        errorMessage: MESSAGES_ERROR.EMAIL_IS_INVALID
      },
      notEmpty: {
        errorMessage: MESSAGES_ERROR.EMAIL_IS_REQUIRED
      },
      trim: true,
      custom: {
        options: async (value: string) => {
          const result = await userService.checkEmailExist(value)
          if (result) {
            throw new Error(MESSAGES_ERROR.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    name: {
      notEmpty: {
        errorMessage: MESSAGES_ERROR.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: MESSAGES_ERROR.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 50
        },
        errorMessage: MESSAGES_ERROR.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },
    password: {
      notEmpty: { errorMessage: MESSAGES_ERROR.PASSWORD_IS_REQUIRED },
      isString: {
        errorMessage: MESSAGES_ERROR.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: MESSAGES_ERROR.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: MESSAGES_ERROR.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      notEmpty: {
        errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 8,
          max: 50
        },
        errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      trim: true,
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        // Dùng để so sánh form password có match form confirm password hay không?
        options: (value, { req }) => value === req.body.password,
        errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: MESSAGES_ERROR.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  })
)
