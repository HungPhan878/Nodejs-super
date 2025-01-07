import { TweetAudience, TweetTypes } from '~/constants/enums'
import { ParamsDictionary, Query } from 'express-serve-static-core'
import { Media } from '../Other'

export interface TweetReqBody {
  type: TweetTypes
  audience: TweetAudience
  content: string
  parent_id: null | string // null is main tweet, string is the parent tweet
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface TweetQuery extends Query {
  tweet_type: string
  limit: string
  page: string
}
