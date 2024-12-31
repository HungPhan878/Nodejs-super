import { TweetAudience, TweetTypes } from '~/constants/enums'
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
