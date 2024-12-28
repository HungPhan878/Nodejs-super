import { checkSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { MediaType, TweetAudience, TweetTypes } from '~/constants/enums'
import { TWEET_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

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
