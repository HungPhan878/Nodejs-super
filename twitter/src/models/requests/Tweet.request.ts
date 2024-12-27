import { TweetAudience, TweetTypes } from '~/constants/enums'
import { Media } from '../Orther'

interface TweetReqBody {
  type: TweetTypes
  audience: TweetAudience
  content: string
  parent_id: null | string // null is main tweet, string is the parent tweet
  hashtag: string[]
  mentions: string[]
  media: Media[]
}
