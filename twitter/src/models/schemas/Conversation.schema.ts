import { ObjectId } from 'mongodb'

interface ConversationType {
  _id?: ObjectId
  sender_id: string
  receiver_id: string
  content: string
  created_at?: Date
  updated_at?: Date
}

export default class Conversation {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  created_at: Date
  updated_at: Date
  constructor(data: ConversationType) {
    const date = new Date()
    this._id = data._id
    this.sender_id = new ObjectId(data.sender_id)
    this.receiver_id = new ObjectId(data.receiver_id)
    this.content = data.content || ''
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
