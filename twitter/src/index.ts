// index.js hoặc app.js
import express from 'express'
import dbService from './services/database.services'
import defaultErrorHandler from './middlewares/error.middlewares'
import userRouter from './routes/user.routes'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import staticRouter from './routes/static.routes'
import { UPLOAD_DIR_VIDEO } from './constants/dir'
import cors from 'cors'
import tweetRouter from './routes/tweet.routes'
import bookmarkRouter from './routes/bookmark.routes'
import likeRouter from './routes/like.routes'
import searchRouter from './routes/Search.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from './models/schemas/Conversation.schema'
import conversationRouter from './routes/conversation.routes'

config()
const app = express()
const port = process.env.PORT || 4000
const httpServer = createServer(app)
const io = new Server(httpServer, {
  /* Grant permission for localhost:3000 access */
  cors: {
    origin: 'http://localhost:3000'
  }
})

dbService.connect().then(() => {
  dbService.indexUsers()
  dbService.indexRefreshToken()
  dbService.indexFollowers()
  dbService.indexVideoStatus()
  dbService.indexTweets()
})
// Create a uploads folder
initFolder()

//Allow everything api access to the server
app.use(cors())
// add middleware handlers for json
app.use(express.json())
// Gắn router user vào đường dẫn /users
app.use('/users', userRouter)
// Gắn router media vào đường dẫn /medias
app.use('/medias', mediaRouter)
// router tweet into url /tweets
app.use('/tweets', tweetRouter)
// router bookmarks into url /bookmarks
app.use('/bookmarks', bookmarkRouter)
// router likes into url /likes
app.use('/likes', likeRouter)
// router search into url /search
app.use('/search', searchRouter)
// router conversations into url /conversations
app.use('/conversations', conversationRouter)
// Serving static files
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_DIR_VIDEO))
// error handler
app.use(defaultErrorHandler)
// Socket io
const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  // B1: Save user_id in object easy to manage
  users[user_id] = {
    socket_id: socket.id
  }
  console.log({ users })

  //B2: receive message from client 1 and send client 2
  socket.on('private message', async (data) => {
    const receiver_socket_id = users[data.to]?.socket_id
    if (!receiver_socket_id) return
    //Save message to database
    await dbService.conversations.insertOne(
      new Conversation({
        sender_id: data.from, // socket translated from id to object id
        receiver_id: data.to,
        content: data.content
      })
    )
    socket.to(receiver_socket_id).emit('receive private message', {
      content: data.content,
      from: user_id
    })
  })
  socket.on('disconnect', () => {
    //B1: Remove users when user has disconnected
    delete users[user_id]
    console.log(`User ${socket.id} disconnected`)
    console.log({ users })
  })
})

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
