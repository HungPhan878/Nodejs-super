import { Collection, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/user.schema'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'
import { Follower } from '~/models/schemas/Follower.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'

// help me use file .env
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.z2myd.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

// Create a MongoClient and connect to MongoDB by class constructor
class DatabaseService {
  private client
  private db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
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
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }
}

const dbService = new DatabaseService()

export default dbService
