import Bookmark from '~/models/schemas/Bookmark.schema'
import dbService from './database.services'
import { WithId } from 'mongodb'

class BookmarkService {
  async bookmarkTweet(tweet_id: string, user_id: string) {
    const result = await dbService.bookmarks.findOneAndUpdate(
      {
        tweet_id: new Object(tweet_id),
        user_id: new Object(user_id)
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
}

const bookmarkService = new BookmarkService()

export default bookmarkService
