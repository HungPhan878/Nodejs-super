import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEET_MESSAGES } from '~/constants/messages'
import { TweetReqBody } from '~/models/requests/Tweet.request'
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
    views: (req.tweet as Tweet & { views: number }).views + 1
  }
  res.status(200).json({ message: TWEET_MESSAGES.GET_TWEET_SUCCESSFULLY, result: tweet })
}
