import { ObjectId } from 'mongodb'
import { TweetAudience, TweetTypes } from '~/constants/enums'
import { Media } from '../Orther'

interface TweetType {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetTypes
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date
}

export class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetTypes
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at?: Date
  updated_at?: Date

  constructor(data: TweetType) {
    const date = new Date()
    this._id = data._id
    this.user_id = data.user_id
    this.type = data.type || TweetTypes.Tweet
    this.audience = data.audience
    this.content = data.content
    this.parent_id = data.parent_id
    this.hashtags = data.hashtags
    this.mentions = data.mentions
    this.medias = data.medias
    this.guest_views = data.guest_views
    this.user_views = data.user_views
    this.created_at = date
    this.updated_at = date
  }
}
