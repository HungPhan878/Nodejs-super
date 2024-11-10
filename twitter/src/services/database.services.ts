import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

// help me use file .env
config()

console.log(process.env.DB_USERNAME)
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.z2myd.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

// Create a MongoClient and connect to MongoDB by class constructor
class DatabaseService {
  private client
  constructor() {
    this.client = new MongoClient(uri)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (err) {
      console.dir('Failed to ping your deployment. Please check your MongoDB connection details.', err)
      throw err
    } finally {
      // Ensures that the client will close when you finish/error
      await this.client.close()
    }
  }
}

const dbService = new DatabaseService()

export default dbService
