import User from './models/schemas/user.schema'

// Declare to type of request from client (only declare once)
declare module 'express' {
  interface Request {
    user?: User
  }
}
