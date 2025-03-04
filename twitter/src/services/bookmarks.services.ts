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

  async GetBookmarkTweets({
    user_id,
    limit,
    page
  }: {
    user_id: string
    limit: number
    page: number
  }) {
    const $match = {
      user_id: new ObjectId(user_id)
    }
    const [tweets, total] = await Promise.all([
      dbService.bookmarks
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'tweets',
              localField: 'tweet_id',
              foreignField: '_id',
              as: 'tweet'
            }
          },
          {
            $unwind: {
              path: '$tweet'
            }
          },
          {
            $project: {
              tweet: 1,
              _id: 0
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'tweet.user_id',
              foreignField: '_id',
              as: 'tweet.user'
            }
          },
          {
            $unwind: {
              path: '$tweet.user'
            }
          },
          {
            $project: {
              tweet: {
                user_id: 0,
                user: {
                  forgot_password_token: 0,
                  email_verify_token: 0,
                  date_of_birth: 0,
                  password: 0,
                  twitter_circle: 0,
                  verify: 0
                }
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      dbService.bookmarks
        .aggregate([
          {
            $match
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    const listTweet = tweets.map((tweet) => tweet.tweet)
    return {
      listTweet,
      total: total[0]?.total || 0
    }
  }
}

const bookmarkService = new BookmarkService()

export default bookmarkService
