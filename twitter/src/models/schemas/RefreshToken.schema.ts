import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at?: Date
  user_id: ObjectId
}

export class RefreshToken {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId

  constructor(data: RefreshTokenType) {
    this._id = data._id
    this.token = data.token
    this.created_at = data.created_at || new Date()
    this.user_id = data.user_id
  }
}
