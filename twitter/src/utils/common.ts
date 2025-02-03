import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { Request } from 'express'
import { verifyToken } from './jwt'
import { capitalize } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'

export const numberEnumToArray = (value: { [key: string]: number | string }) => {
  return Object.values(value).filter((key) => typeof key === 'number')
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
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
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
}
