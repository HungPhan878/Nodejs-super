import { Router } from 'express'
import { createTweetController, getTweetController } from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  tweetIdValidator
} from '~/middlewares/tweet.middlewares'
import {
  accessTokenValidator,
  isUserLoggedInValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const tweetRouter = Router()

/**
 * Description: Create a tweet
 * Path: /
 * Method: POST
 * Body:TweetReqBody
 * Headers: {Authorization: "Bearer <access_token>"}
 * */
tweetRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Description: Get a tweet detail
 * Path: /:tweet_id
 * Method: Get
 * */
tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapRequestHandler(audienceValidator), // audience validator is async so should try catch or method wrapRequestHandler
  wrapRequestHandler(getTweetController)
)

/**
 * Description: Get a tweet detail
 * Path: /:tweet_id
 * Method: Get
 * */
tweetRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapRequestHandler(audienceValidator), // audience validator is async so should try catch or method wrapRequestHandler
  wrapRequestHandler(getTweetController)
)

export default tweetRouter
