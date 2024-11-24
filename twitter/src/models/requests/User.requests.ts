import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes } from '~/constants/enums'

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

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
}
