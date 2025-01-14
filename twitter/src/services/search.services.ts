import { MediaQueryType, MediaType, PeopleFollowedType, TweetTypes } from '~/constants/enums'
import dbService from './database.services'
import { ObjectId } from 'mongodb'

class SearchService {
  async search({
    limit,
    page,
    content,
    media_type,
    people_followed,
    user_id
  }: {
    limit: number
    page: number
    content: string
    people_followed?: PeopleFollowedType
    media_type?: MediaQueryType
    user_id: string
  }) {
    const user_id_obj = new ObjectId(user_id)
    const $match: {
      $text: {
        $search: string
      }
      [key: string]: any
    } = {
      $text: {
        $search: content
      }
    }
    //If have media type
    if (media_type) {
      if (media_type === MediaQueryType.Image) {
        $match['medias.type'] = MediaType.Image
      }
      if (media_type === MediaQueryType.Video) {
        $match['medias.type'] = { $in: [MediaType.Video, MediaType.HLS] }
      }
    }
    //If have people followed === '1'
    if (people_followed && people_followed === PeopleFollowedType.Followings) {
      const followed_user_ids = await dbService.followers
        .find(
          { user_id: user_id_obj },
          {
            projection: {
              followed_user_id: 1,
              _id: 0
            }
          }
        )
        .toArray() // Because return results so toArray to return a object[]
      const ids = followed_user_ids.map((item) => item.followed_user_id)
      // Add id of user that into array
      ids.push(user_id_obj)
      $match['user_id'] = { $in: ids }
    }
    const [tweets, total] = await Promise.all([
      dbService.tweets
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [user_id_obj]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $lookup: {
              from: 'hashtags',
              localField: 'hashtags',
              foreignField: '_id',
              as: 'hashtags'
            }
          },
          {
            $addFields: {
              hashtags: {
                $map: {
                  input: '$hashtags',
                  as: 'hashtag',
                  in: {
                    _id: '$$hashtag._id',
                    name: '$$hashtag.name'
                  }
                }
              }
            }
          },
          {
            $lookup: {
              from: 'mentions',
              localField: 'mentions',
              foreignField: '_id',
              as: 'mentions'
            }
          },
          {
            $lookup: {
              from: 'bookmarks',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'bookmarks'
            }
          },
          {
            $lookup: {
              from: 'likes',
              localField: '_id',
              foreignField: 'tweet_id',
              as: 'likes'
            }
          },
          {
            $lookup: {
              from: 'tweets',
              localField: '_id',
              foreignField: 'parent_id',
              as: 'tweet_children'
            }
          },
          {
            $addFields: {
              bookmarks: {
                $size: '$bookmarks'
              },
              likes: {
                $size: '$likes'
              },
              retweet_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetTypes.Retweet]
                    }
                  }
                }
              },
              comment_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetTypes.Comment]
                    }
                  }
                }
              },
              quote_count: {
                $size: {
                  $filter: {
                    input: '$tweet_children',
                    as: 'item',
                    cond: {
                      $eq: ['$$item.type', TweetTypes.QuoteTweet]
                    }
                  }
                }
              },
              views: {
                $add: ['$guest_views', '$user_views']
              }
            }
          },
          {
            $project: {
              tweet_children: 0,
              user: {
                forgot_password_token: 0,
                email_verify_token: 0,
                date_of_birth: 0,
                password: 0,
                twitter_circle: 0
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
      dbService.tweets
        .aggregate([
          {
            $match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.twitter_circle': {
                        $in: [user_id_obj]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])
    //Increase view
    const tweet_ids = tweets.map((tweet) => tweet._id as ObjectId)
    const date = new Date()
    await dbService.tweets.updateMany(
      { _id: { $in: tweet_ids } },
      {
        $inc: { user_views: 1 },
        $set: {
          updated_at: date
        }
      }
    )
    tweets.forEach((tweet) => {
      tweet.updated_at = date
      tweet.user_views += 1
      tweet.views += 1
    })

    return {
      tweets,
      total: total[0]?.total || 0
    }
  }
}

const searchService = new SearchService()

export default searchService
