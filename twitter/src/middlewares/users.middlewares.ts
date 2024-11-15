import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
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
      isEmail: true,
      notEmpty: true,
      trim: true,
      custom: {
        options: async (value: string) => {
          const result = await userService.checkEmailExist(value)
          if (result) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 50
        }
      },
      trim: true,
      errorMessage: 'Please enter name'
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
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
        errorMessage:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 8,
          max: 50
        }
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
        errorMessage:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol'
      },
      custom: {
        // Dùng để so sánh form password có match form confirm password hay không?
        options: (value, { req }) => value === req.body.password,
        errorMessage: 'Passwords do not match'
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
