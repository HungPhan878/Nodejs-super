import { Router } from 'express'
import { getConversationController } from '~/controllers/conversations.controllers'
import { paginationValidator } from '~/middlewares/tweet.middlewares'

import {
  accessTokenValidator,
  getConversationValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const conversationRouter = Router()

/**
 * Description: get conversation
 * Path: /receivers/:receiver_id
 * Method: GET
 * headers:{Authorization: bearer <access_token>}
 * Query Parameters:{
 * limit: number,
 * page: number
 * }
 * Params:{
 * receiver_id: string
 * }
 */
conversationRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  getConversationValidator,
  wrapRequestHandler(getConversationController)
)

export default conversationRouter
