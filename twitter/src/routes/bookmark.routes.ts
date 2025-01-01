import { Router } from 'express'
import {
  bookmarkTweetController,
  unBookmarkTweetController
} from '~/controllers/bookmarks.controllers'
import { tweetIdValidator } from '~/middlewares/tweet.middlewares'

import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const bookmarkRouter = Router()

/**
 * Description: Bookmark tweet
 * Path: /
 * Method: POST
 * Body: {"tweet_id":string}
 * headers:{Authorization: bearer <access_token>}
 */
bookmarkRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * Description: unBookmark tweet
 * Path: /tweet/:tweet_id
 * Method: DELETE
 * headers:{Authorization: bearer <access_token>}
 */
bookmarkRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unBookmarkTweetController)
)

export default bookmarkRouter
