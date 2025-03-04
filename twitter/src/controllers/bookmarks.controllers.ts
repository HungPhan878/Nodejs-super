import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARK_MESSAGES } from '~/constants/messages'
import { BookmarkReqBody } from '~/models/requests/Bookmark.request'
import { TokenPayload } from '~/models/requests/User.requests'
import bookmarkService from '~/services/bookmarks.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(req.body.tweet_id, user_id)
  res.status(200).json({ message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY, result })
}

export const unBookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await bookmarkService.unBookmarkTweet(req.params.tweet_id, user_id)
  res.status(200).json({ message: BOOKMARK_MESSAGES.DELETE_BOOKMARK_SUCCESSFULLY })
}

export const GetBookmarkTweetsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { listTweet, total } = await bookmarkService.GetBookmarkTweets({ user_id, limit, page })
  res.status(200).json({
    message: BOOKMARK_MESSAGES.GET_BOOKMARKS_SUCCESSFULLY,
    result: {
      tweets: listTweet,
      page,
      limit,
      total_page: Math.ceil(total / limit)
    }
  })
}
