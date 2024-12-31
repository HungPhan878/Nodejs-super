import { TweetReqBody } from '~/models/requests/Tweet.request'
import dbService from './database.services'
import { Tweet } from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { WithId } from 'mongodb'

class TweetService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Find hashtag if it no exists is create new
        return dbService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          {
            upsert: true,
            returnDocument: 'after'
          }
        )
      })
    )
    return hashtagDocuments.map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }
  async createTweet(body: TweetReqBody, user_id: string) {
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    const result = await dbService.tweets.insertOne(
      new Tweet({
        user_id,
        type: body.type,
        audience: body.audience,
        content: body.content,
        parent_id: body.parent_id,
        hashtags,
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
