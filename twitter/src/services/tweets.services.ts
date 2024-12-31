import { TweetReqBody } from '~/models/requests/Tweet.request'
import dbService from './database.services'
import { Tweet } from '~/models/schemas/Tweet.schema'

class TweetService {
  async createTweet(body: TweetReqBody, user_id: string) {
    const result = await dbService.tweets.insertOne(
      new Tweet({
        user_id,
        type: body.type,
        audience: body.audience,
        content: body.content,
        parent_id: body.parent_id,
        hashtags: [],
        mentions: body.mentions,
        medias: body.medias
      })
    )
    const tweet = await dbService.tweets.findOne({ _id: result.insertedId })

    return tweet
  }
}

const tweetService = new TweetService()
export default tweetService
