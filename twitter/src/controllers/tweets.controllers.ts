import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TweetTypes } from '~/constants/enums'
import { TWEET_MESSAGES } from '~/constants/messages'
import { TweetParam, TweetQuery, TweetReqBody } from '~/models/requests/Tweet.request'
import { TokenPayload } from '~/models/requests/User.requests'
import { Tweet } from '~/models/schemas/Tweet.schema'
import tweetService from '~/services/tweets.services'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, TweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetService.createTweet(req.body, user_id)
  res.status(200).json({ message: TWEET_MESSAGES.CREATE_TWEET_SUCCESSFULLY, result })
}

export const getTweetController = async (req: Request, res: Response) => {
  const { tweet_id } = req.params
  const result = await tweetService.increaseView(tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result.guest_views,
    user_views: result.user_views,
    updated_at: result.updated_at,
    views: (req.tweet as Tweet & { views: number }).views + 1
  }
  res.status(200).json({ message: TWEET_MESSAGES.GET_TWEET_SUCCESSFULLY, result: tweet })
}

export const getTweetChildrenController = async (
  req: Request<TweetParam, any, any, TweetQuery>,
  res: Response
) => {
  const tweet_type = Number(req.query.tweet_type as string) as TweetTypes
  const limit = Number(req.query.limit as string)
  const page = Number(req.query.page as string)
  const { tweets, total } = await tweetService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    user_id: req.decoded_authorization?.user_id,
    tweet_type,
    limit,
    page
  })
  res.status(200).json({
    message: TWEET_MESSAGES.GET_TWEET_CHILDREN_SUCCESSFULLY,
    result: {
      tweets,
      page,
      limit,
      tweet_type,
      total_page: Math.ceil(total / limit)
    }
  })
}
