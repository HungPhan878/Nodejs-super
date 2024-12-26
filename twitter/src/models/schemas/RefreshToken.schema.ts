import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
  iat: number
  exp: number
}

export class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  iat: Date
  exp: Date

  constructor(data: RefreshTokenType) {
    this._id = data._id
    this.token = data.token
    this.created_at = data.created_at || new Date()
    this.user_id = data.user_id
    this.iat = new Date(data.iat * 1000) // Convert from epoch time to Date
    this.exp = new Date(data.exp * 1000) // Convert from epoch time to Date
  }
}
