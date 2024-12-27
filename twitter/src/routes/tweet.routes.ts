import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const tweetRouter = Router()

/**
 * Description: Create a tweet
 * Path: /
 * Method: POST
 * Body:TweetReqBody
 * */
tweetRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(createTweetController)
)

export default tweetRouter
