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
import conversationRouter from './routes/conversation.routes'
import initialSocket from './utils/socket'
import swaggerUi from 'swagger-ui-express'
// import YAML from 'yaml'
// import fs from 'fs'
// import path from 'path'
import swaggerJsdoc from 'swagger-jsdoc'
import { envConfig } from './constants/config'

const app = express()
const port = envConfig.port 
const httpServer = createServer(app)

// Swagger ui
//C1: YAML + swagger jsdoc + swagger ui
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'X CLONE PROJECT(TWITTER API)',
      version: '1.0.0'
    }
  },
  apis: ['./swagger/*.yaml'] // files containing annotations as above
}

const openapiSpecification = swaggerJsdoc(options)
//C2:
// const file = fs.readFileSync(path.resolve('twitter-swagger.yaml'), 'utf8')
// const swaggerDocument = YAML.parse(file)

dbService.connect().then(() => {
  dbService.indexUsers()
  dbService.indexRefreshToken()
  dbService.indexFollowers()
  dbService.indexVideoStatus()
  dbService.indexTweets()
})
// Create a uploads folder
initFolder()

// Doc file yaml
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
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

// Initial Socket
initialSocket(httpServer)

httpServer.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
