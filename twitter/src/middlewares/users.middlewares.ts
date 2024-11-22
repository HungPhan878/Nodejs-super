import { checkSchema } from 'express-validator'
import MESSAGES_ERROR from '~/constants/messages'
import dbService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'

// components
import { validate } from '~/utils/validation'

export const loginValidator = validate(
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
        options: async (value: string, { req }) => {
          const user = await dbService.users.findOne({
            email: value,
            password: hashPassword(req.body.password)
          })
          if (user === null) {
            throw new Error(MESSAGES_ERROR.USER_NOT_FOUND)
          }
          req.user = user
          return true
        }
      }
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
    }
  })
)
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
