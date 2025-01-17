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

config()
const app = express()
const port = process.env.PORT || 4000

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
// Serving static files
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_DIR_VIDEO))
// error handler
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
