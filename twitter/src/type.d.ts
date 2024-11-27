import { TokenPayload } from './models/requests/User.requests'
import User from './models/schemas/user.schema'

// Declare to type of request from client (only declare once)
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    refresh_token?: string
  }
}
