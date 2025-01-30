import { ObjectId } from 'mongodb'
import dbService from './database.services'

export class ConversationService {
  async getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  }: {
    sender_id: string
    receiver_id: string
    limit: number
    page: number
  }) {
    const conversations = await dbService.conversations
      .find({
        $or: [
          { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
          { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
        ]
      })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    const total = await dbService.conversations.countDocuments({
      $or: [
        { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
        { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
      ]
    })
    // Optimize performance
    return { conversations, total }
  }
}

const conversationService = new ConversationService()

export default conversationService
