import { Collection, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/user.schema'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'
import { Follower } from '~/models/schemas/Follower.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { Tweet } from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Like from '~/models/schemas/Like.schema'
import Conversation from '~/models/schemas/Conversation.schema'
import { envConfig } from '~/constants/config'

// help me use file .env

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter.z2myd.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

// Create a MongoClient and connect to MongoDB by class constructor
class DatabaseService {
  private client
  private db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1', 'email_1_password_1', 'username_1'])
    if (!exists) {
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
      this.users.createIndex({ email: 1, password: 1 })
    }
  }

  async indexRefreshToken() {
    const exists = await this.refreshToken.indexExists(['token_1', 'exp_1'])
    if (!exists) {
      this.refreshToken.createIndex({ token: 1 })
      this.refreshToken.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
    }
  }

  async indexFollowers() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (!exists) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  async indexVideoStatus() {
    const exists = await this.videoStatus.indexExists(['name_1'])
    if (!exists) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.dir(
        'Failed to ping your deployment. Please check your MongoDB connection details.',
        err
      )
      throw err
    }
    // finally {
    //    Ensures that the client will close when you finish/error
    //   await this.client.close()
    // }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection as string)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection as string)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection as string)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection as string)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection as string)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection as string)
  }
}

const dbService = new DatabaseService()

export default dbService
