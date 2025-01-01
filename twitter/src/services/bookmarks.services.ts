import Bookmark from '~/models/schemas/Bookmark.schema'
import dbService from './database.services'
import { ObjectId, WithId } from 'mongodb'

class BookmarkService {
  async bookmarkTweet(tweet_id: string, user_id: string) {
    const result = await dbService.bookmarks.findOneAndUpdate(
      {
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      },
      {
        $setOnInsert: new Bookmark({
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
      _id: (result as WithId<Bookmark>)._id
    }
  }

  async unBookmarkTweet(tweet_id: string, user_id: string) {
    const result = await dbService.bookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()

export default bookmarkService
