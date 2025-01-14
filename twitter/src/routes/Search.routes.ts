import { Router } from 'express'
import { searchController } from '~/controllers/Search.controllers'
import { searchValidator } from '~/middlewares/Search.middlewares'
import { paginationValidator } from '~/middlewares/tweet.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
const searchRouter = Router()

/**
 * Description: Search text
 * Path: /
 * Method: Get
 * Headers: {Authorization: "Bearer <access_token>"}
 * Query Parameters:{
 * page: number,
 * limit: number,
 * content: string
 * media_type: MediaQueryType
 * people_followed: '0' or '1'
 * }
 * */
searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  searchValidator,
  wrapRequestHandler(searchController)
)

export default searchRouter
