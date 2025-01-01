import dbService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Like from '~/models/schemas/Like.schema'

class LikeService {
  async likeTweet(tweet_id: string, user_id: string) {
    const result = await dbService.likes.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Like({
          user_id,
          tweet_id
        })
      },
      {
        upsert: true,
        returnDocument: 'after'
      }
    )
    return {
      _id: (result as WithId<Like>)._id
    }
  }

  async unlikeTweet(tweet_id: string, user_id: string) {
    const result = await dbService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const likeService = new LikeService()

export default likeService
