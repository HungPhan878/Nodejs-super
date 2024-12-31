import { ObjectId } from 'mongodb'
import { TweetAudience, TweetTypes } from '~/constants/enums'
import { Media } from '../Other'

interface TweetType {
  _id?: ObjectId
  user_id: string
  type: TweetTypes
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc
  hashtags: ObjectId[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
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
    this.user_id = new ObjectId(data.user_id)
    this.type = data.type || TweetTypes.Tweet
    this.audience = data.audience
    this.content = data.content
    this.parent_id = data.parent_id ? new ObjectId(data.parent_id) : null
    this.hashtags = data.hashtags
    this.mentions = data.mentions.map((item) => new ObjectId(item))
    this.medias = data.medias
    this.guest_views = data.guest_views || 0
    this.user_views = data.user_views || 0
    this.created_at = data.created_at || date
    this.updated_at = data.updated_at || date
  }
}
