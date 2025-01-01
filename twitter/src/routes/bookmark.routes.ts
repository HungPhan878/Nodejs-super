import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmarks.controllers'

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
  wrapRequestHandler(bookmarkTweetController)
)

export default bookmarkRouter
