import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { ParamsDictionary } from 'express-serve-static-core'

export interface LoginBodyRed {
  email: string
  password: string
}

export interface RegisterBodyReq {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutBodyReq {
  refresh_token: string
}

export interface RefreshBodyReq {
  refresh_token: string
}

export interface ResetPasswordBodyReq {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface UpdateMeBodyReq {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface GetProfileUserBodyReq extends ParamsDictionary {
  username: string
}

export interface FollowUserBodyReq {
  followed_user_id: string
}

export interface UnFollowUserBodyReq extends ParamsDictionary {
  user_id: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
  verify: UserVerifyStatus
}
