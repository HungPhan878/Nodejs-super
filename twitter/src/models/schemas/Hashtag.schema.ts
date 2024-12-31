import { ObjectId } from 'mongodb'

interface HashtagType {
  _id?: ObjectId
  name: string
  created_at?: Date
}

export default class Hashtag {
  _id?: ObjectId
  name: string
  created_at: Date

  constructor(data: HashtagType) {
    this._id = data._id || new ObjectId() // Create a new id because method findAndUpdate no auto id
    this.name = data.name
    this.created_at = data.created_at || new Date()
  }
}
