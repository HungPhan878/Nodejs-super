import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSAGES } from '~/constants/messages'
import { LikeReqBody } from '~/models/requests/Like.request'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'

export const likeTweetController = async (
  req: Request<ParamsDictionary, any, LikeReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeTweet(req.body.tweet_id, user_id)
  res.status(200).json({ message: LIKE_MESSAGES.LIKE_SUCCESSFULLY, result })
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await likeService.unlikeTweet(req.params.tweet_id, user_id)
  res.status(200).json({ message: LIKE_MESSAGES.DELETE_LIKE_SUCCESSFULLY })
}

export const GetLikedTweetsController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { listTweet, total } = await likeService.GetLikedTweets({ user_id, limit, page })
  res.status(200).json({
    message: LIKE_MESSAGES.GET_LIKES_SUCCESSFULLY,
    result: {
      tweets: listTweet,
      page,
      limit,
      total_page: Math.ceil(total / limit)
    }
  })
}
