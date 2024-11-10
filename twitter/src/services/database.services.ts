import { MongoClient } from 'mongodb'
const uri =
  'mongodb+srv://phanvanhung:Phanvanhung789@twitter.z2myd.mongodb.net/?retryWrites=true&w=majority&appName=Twitter'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)

export async function run() {
  try {
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
