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
    const match = {
      $or: [
        { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
        { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
      ]
    }
    const [conversations, total] = await Promise.all([
      dbService.conversations
        .find(match)
        .sort({ created_at: -1 })
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray(),
      dbService.conversations.countDocuments(match)
    ])

    // Optimize performance
    return { conversations, total }
  }
}

const conversationService = new ConversationService()

export default conversationService
