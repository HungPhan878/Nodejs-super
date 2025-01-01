import { Router } from 'express'
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'

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

export default likeRouter
