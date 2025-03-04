import { Router } from 'express'
import {
  GetLikedTweetsController,
  likeTweetController,
  unlikeTweetController
} from '~/controllers/likes.controllers'
import { paginationValidator, tweetIdValidator } from '~/middlewares/tweet.middlewares'

import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const likeRouter = Router()

/**
 * Description: like tweet
 * Path: /
 * Method: POST
 * Body: {"tweet_id":string}
 * headers:{Authorization: bearer <access_token>}
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/**
 * Description: unlike tweet
 * Path: /tweet/:tweet_id
 * Method: DELETE
 * headers:{Authorization: bearer <access_token>}
 */
likeRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator, // Create a tweetIdValidator to use routes
  wrapRequestHandler(unlikeTweetController)
)

/**
 * Description: Get List liked tweet
 * Path: /
 * Method: GET
 * headers:{Authorization: bearer <access_token>}
 * Query Parameters:{
 * page: number,
 * limit: number,
 */
likeRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  wrapRequestHandler(GetLikedTweetsController)
)

export default likeRouter
