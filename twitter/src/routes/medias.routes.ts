import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHlsController,
  videoStatusController
} from '~/controllers/medias.controllers'
import {
  accessTokenValidator,
  refreshTokenValidator,
  verifiedUserValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const mediaRouter = Router()

/**
 * Description: Upload image files
 * Path: /upload-image
 * Method: POST
 * Headers: {Authorization: "Bearer <access_token>"}
 */
mediaRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

/**
 * Description: Upload video files
 * Path: /upload-video
 * Method: POST
 * Headers: {Authorization: "Bearer <access_token>"}
 */
mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

/**
 * Description: Upload video files hls
 * Path: /upload-video-hls
 * Method: POST
 * Body: {}
 */
mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoHlsController)
)

/**
 * Description: Get status of video
 * Path: /video-status/:id
 * Method: GET
 * headers: { 'Authorization: Bearer <access_token>'}
 */
mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(videoStatusController)
)

export default mediaRouter
