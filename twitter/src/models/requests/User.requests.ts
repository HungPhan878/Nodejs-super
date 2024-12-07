import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'

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

export interface getProfileUserBodyReq {
  username: string
}

export interface followUserBodyReq {
  followed_user_id: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
  verify: UserVerifyStatus
}
