import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import capitalize from 'lodash/capitalize'
import { NextFunction, Request, Response } from 'express'

import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import dbService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '~/models/requests/User.requests'
import { UserVerifyStatus } from '~/constants/enums'
import { REGEX_USERNAME } from '~/constants/regexes'

config()

//Create constants for reuse
const passwordSchema: ParamSchema = {
  notEmpty: { errorMessage: MESSAGES_ERROR.PASSWORD_IS_REQUIRED },
  isString: {
    errorMessage: MESSAGES_ERROR.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 8,
      max: 50
    },
    errorMessage: MESSAGES_ERROR.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: MESSAGES_ERROR.PASSWORD_MUST_BE_STRONG
  },
  trim: true
}
const confirmPasswordSchema: ParamSchema = {
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
    errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
}
const forgotPasswordTokenSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: MESSAGES_ERROR.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      try {
        // When 2 awaits can run together and independent, they should be run together by Promise.all
        const decoded_forgot_password_token = await verifyToken({
          token: value as string,
          secretOrPublicKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string
        })
        const { user_id } = decoded_forgot_password_token
        const user = await dbService.users.findOne({
          _id: new ObjectId(user_id)
        })
        if (user === null) {
          throw new ErrorWithStatus({
            message: MESSAGES_ERROR.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: MESSAGES_ERROR.FORGOT_PASSWORD_IS_INVALID,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
      } catch (error) {
        // If the error is verifyToken failed
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize((error as JsonWebTokenError).message),
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
      return true
    }
  }
}
const nameSchema: ParamSchema = {
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
}
const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: MESSAGES_ERROR.DATE_OF_BIRTH_MUST_BE_ISO8601
  }
}
const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: MESSAGES_ERROR.IMAGE_URL_MUST_BE_STRING
  },
  trim: true,
  isLength: {
    options: {
      min: 1,
      max: 200
    },
    errorMessage: MESSAGES_ERROR.IMAGE_URL_LENGTH
  }
}
const userIdSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: MESSAGES_ERROR.INVALID_USER_ID,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      const followed_user = await dbService.users.findOne({
        _id: new ObjectId(value)
      })
      if (followed_user === null) {
        throw new ErrorWithStatus({
          message: MESSAGES_ERROR.USER_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
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
              throw new Error(MESSAGES_ERROR.EMAIL_OR_PASSWORD_IS_INCORRECT)
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
          errorMessage: MESSAGES_ERROR.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
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
      name: nameSchema,
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
          errorMessage: MESSAGES_ERROR.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
          errorMessage: MESSAGES_ERROR.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
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
      date_of_birth: dateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            const access_token = (value || '').split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_authorization = await verifyToken({
                token: access_token,
                secretOrPublicKey: process.env.JWT_ACCESS_TOKEN_SECRET as string
              })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              // When 2 awaits can run together and independent, they should be run together by Promise.all
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  token: value as string,
                  secretOrPublicKey: process.env.JWT_REFRESH_TOKEN_SECRET as string
                }),
                dbService.refreshToken.findOne({ token: value as string })
              ])
              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: MESSAGES_ERROR.REFRESH_TOKEN_USED_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              // why is this cast as Request  here?
              //Because req is not the req from express so we need to cast it as Request to use type defined in type.d.ts
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
              ;(req as Request).refresh_token = value
            } catch (error) {
              // If the error is verifyToken failed
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              // if the error is refresh_token === null
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.EMAIL_VERIFY_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value as string,
                secretOrPublicKey: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string
              })

              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              // If the error is verifyToken failed
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: MESSAGES_ERROR.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: MESSAGES_ERROR.EMAIL_IS_INVALID
      },
      custom: {
        options: async (value, { req }) => {
          const user = await dbService.users.findOne({ email: value })
          if (user === null) {
            throw new Error(MESSAGES_ERROR.USER_NOT_FOUND)
          }
          ;(req as Request).user = user
          return true
        }
      }
    }
  })
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema({
    forgot_password_token: {
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: MESSAGES_ERROR.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            // When 2 awaits can run together and independent, they should be run together by Promise.all
            const decoded_forgot_password_token = await verifyToken({
              token: value as string,
              secretOrPublicKey: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string
            })
            const { user_id } = decoded_forgot_password_token
            const user = await dbService.users.findOne({
              _id: new ObjectId(user_id)
            })
            if (user === null) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.USER_NOT_FOUND,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            if (user.forgot_password_token !== value) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.FORGOT_PASSWORD_IS_INVALID,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
          } catch (error) {
            // If the error is verifyToken failed
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }
          return true
        }
      }
    }
  })
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirm_password: confirmPasswordSchema,
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        message: MESSAGES_ERROR.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        ...nameSchema,
        optional: true,
        isEmpty: undefined
      },
      date_of_birth: {
        ...dateOfBirthSchema,
        optional: true
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: MESSAGES_ERROR.BIO_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: { min: 1, max: 200 },
          errorMessage: MESSAGES_ERROR.BIO_LENGTH
        }
      },
      location: {
        optional: true,
        isString: {
          errorMessage: MESSAGES_ERROR.LOCATION_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: MESSAGES_ERROR.LOCATION_LENGTH
        }
      },
      website: {
        optional: true,
        isString: {
          errorMessage: MESSAGES_ERROR.WEBSITE_MUST_BE_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: MESSAGES_ERROR.WEBSITE_LENGTH
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: MESSAGES_ERROR.USERNAME_MUST_BE_STRING
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            //If the value invalid is into here
            if (!REGEX_USERNAME.test(value)) {
              throw new Error(MESSAGES_ERROR.USERNAME_INVALID)
            }

            const user = await dbService.users.findOne({
              username: value
            })
            //if username already exists is into here
            if (user) {
              throw new Error(MESSAGES_ERROR.USERNAME_EXISTED)
            }
            return true
          }
        }
      },
      avatar: imageSchema,
      cover_photo: imageSchema
    },
    ['body']
  )
)

export const followerValidator = validate(
  checkSchema(
    {
      followed_user_id: userIdSchema
    },
    ['body']
  )
)

export const unFollowValidator = validate(
  checkSchema(
    {
      user_id: userIdSchema
    },
    ['params']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      old_password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const { user_id } = req.decoded_authorization as TokenPayload
            const user = await dbService.users.findOne({ _id: new ObjectId(user_id) })
            if (!user) {
              throw new ErrorWithStatus({
                message: MESSAGES_ERROR.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            const isMatch = hashPassword(value) === user.password
            if (!isMatch) {
              throw new Error(MESSAGES_ERROR.OLD_PASSWORD_NOT_MATCH)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirm_password: confirmPasswordSchema
    },
    ['body']
  )
)

export const isUserLoggedInValidator = (
  middleware: (req: Request, res: Response, next: NextFunction) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      return middleware(req, res, next)
    }
    next()
  }
}
