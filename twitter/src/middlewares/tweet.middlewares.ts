import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetTypes, UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR, { TWEET_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import dbService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'
import { NextFunction, Request, Response } from 'express'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { TokenPayload } from '~/models/requests/User.requests'

const tweetTypes = numberEnumToArray(TweetTypes)
const audienceTypes = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes],
          errorMessage: TWEET_MESSAGES.INVALID_TYPE
        }
      },
      audience: {
        isIn: {
          options: [audienceTypes],
          errorMessage: TWEET_MESSAGES.INVALID_AUDIENCE
        }
      },
      parent_id: {
        custom: {
          options: async (value, { req }) => {
            const type = req.body.type as TweetTypes

            // If `type` is retweet, comment, quotetweet then `parent_id` have `tweet_id` of parent tweet
            if (
              [TweetTypes.Comment, TweetTypes.QuoteTweet, TweetTypes.Retweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEET_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }
            // If `type` is tweet then `parent_id` must be `null`
            if (type === TweetTypes.Tweet && value !== null) {
              throw new Error(TWEET_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }
            return true
          }
        }
      },
      content: {
        isString: true,
        custom: {
          options: async (value, { req }) => {
            const type = req.body.type as TweetTypes
            const hashtags = req.body.hashtag as string[]
            const mentions = req.body.mentions as string[]

            // If `type` is tweet then value must be string, different a empty string
            if (type === TweetTypes.Retweet && value !== '') {
              throw new Error(TWEET_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
            }
            //If `type` is comment, quoteTweet, tweet and not available hashtags and mentions and value by a empty string into here
            if (
              [TweetTypes.Comment, TweetTypes.QuoteTweet, TweetTypes.Tweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEET_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            // hashtags must be an array string
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEET_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            // mentions must be an array of user id
            if (value.some((item: any) => !ObjectId.isValid(item))) {
              throw new Error(TWEET_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: true,
        custom: {
          options: async (value, { req }) => {
            // medias must be an array of media object
            if (
              value.some(
                (item: any) => typeof item.url !== 'string' || !mediaTypes.includes(item.type)
              )
            ) {
              throw new Error(TWEET_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            // In checkSchema have isMongoId can check objectId but not give status other than 422 so we need to check objectId in custom.
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGES.INVALID_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }
            // We only need to get tweet from here and check if the tweet is right then response for client
            // Don't need to query time two
            const [tweet] = await dbService.tweets
              .aggregate<Tweet & { views: number }>([
                {
                  $match: {
                    _id: new ObjectId(value)
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
                    tweet_children: 0
                  }
                }
              ])
              .toArray()
            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEET_MESSAGES.TWEET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).tweet = tweet
            return true
          }
        }
      }
    },
    ['params', 'body']
  )
)

export const audienceValidator = async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    // Check viewer had logged in or not
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({
        message: MESSAGES_ERROR.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // Check author account had blocked or banned or deleted
    const author = await dbService.users.findOne({ _id: new ObjectId(tweet.user_id) })
    if (!author || author.verify === UserVerifyStatus.Banned) {
      throw new ErrorWithStatus({
        message: TWEET_MESSAGES.TWEET_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const { user_id } = req.decoded_authorization as TokenPayload
    const isInTweetCircle = author.twitter_circle.some(
      (user_circle_id) => user_circle_id.equals(user_id) // method equals of ObjectId use to check a ObjectId and a string (ObjectId) have equal or not
    )
    // Check viewer has permission to view Twitter Circle tweet or is author
    // my tweet is i always get it success every time.
    if (!tweet.user_id?.equals(user_id) && !isInTweetCircle) {
      throw new ErrorWithStatus({
        message: TWEET_MESSAGES.TWEET_IS_NOT_PUBLIC,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }
  next()
}
