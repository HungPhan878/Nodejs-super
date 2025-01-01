import { ObjectId } from 'mongodb'

interface BookmarkType {
  _id?: ObjectId
  user_id: string
  tweet_id: string
  created_at?: Date
}

export default class Bookmark {
  _id: ObjectId
  user_id: ObjectId
  tweet_id: ObjectId
  created_at: Date

  constructor(data: BookmarkType) {
    const date = new Date()
    this._id = data._id || new ObjectId()
    this.user_id = new ObjectId(data.user_id)
    this.tweet_id = new ObjectId(data.tweet_id)
    this.created_at = data.created_at || date
  }
}
