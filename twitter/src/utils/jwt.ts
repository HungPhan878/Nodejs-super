import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'

config()
export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) =>
    jwt.sign(payload, privateKey, options, function (err, token) {
      if (err) throw reject(err)
      resolve(token as string)
    })
  )
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) =>
    jwt.verify(token, secretOrPublicKey, function (err, decoded) {
      if (err) throw reject(err)
      resolve(decoded as TokenPayload)
    })
  )
}
