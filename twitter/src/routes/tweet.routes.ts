import { Router } from 'express'
import {
  createTweetController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
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
 * Headers: {Authorization: "Bearer <access_token>"}
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
 * Description: Get tweet children
 * Path: /:tweet_id/children
 * Method: Get
 * Headers: {Authorization: "Bearer <access_token>"}
 * Query Parameters:{
 * page: number,
 * limit: number,
 * tweet_type: TweetType
 * }
 * */
tweetRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapRequestHandler(audienceValidator), // audience validator is async so should try catch or method wrapRequestHandler
  wrapRequestHandler(getTweetChildrenController)
)

export default tweetRouter
