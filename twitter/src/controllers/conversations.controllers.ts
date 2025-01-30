import { Request, Response } from 'express'
import conversationService from '~/services/conversations.services'

export const getConversationController = async (req: Request, res: Response) => {
  const sender_id = req.decoded_authorization?.user_id as string
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { conversations, total } = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })
  res.json({
    message: 'Get conversations successfully',
    result: {
      conversations,
      page,
      limit,
      total_page: Math.ceil(total / limit)
    }
  })
}
