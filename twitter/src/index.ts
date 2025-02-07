// index.js hoặc app.js
import express from 'express'
import dbService from './services/database.services'
import defaultErrorHandler from './middlewares/error.middlewares'
import userRouter from './routes/user.routes'
import mediaRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import staticRouter from './routes/static.routes'
import { UPLOAD_DIR_VIDEO } from './constants/dir'
import cors, { CorsOptions } from 'cors'
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
import { envConfig, isProduction } from './constants/config'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'

const app = express()
const port = envConfig.port
const httpServer = createServer(app)
const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientUrl : '*'
}
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

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

// Apply the rate limiting middleware to all requests.
app.use(limiter)
//helmet
app.use(helmet())
// Doc file yaml
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
//Allow everything api access to the server
app.use(cors(corsOptions))
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
