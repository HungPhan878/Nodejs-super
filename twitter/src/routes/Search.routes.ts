import { Router } from 'express'
import { searchController } from '~/controllers/Search.controllers'
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
 * }
 * */
searchRouter.get(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(searchController)
)

export default searchRouter
