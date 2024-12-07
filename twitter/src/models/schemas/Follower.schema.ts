import { ObjectId } from 'mongodb'

interface FollowerType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
}

export class Follower {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date

  constructor(data: FollowerType) {
    this._id = data._id
    this.followed_user_id = data.followed_user_id
    this.created_at = data.created_at || new Date()
    this.user_id = data.user_id
  }
}
