import { Router } from 'express'
import {
  uploadImageController,
  uploadVideoController,
  uploadVideoHlsController
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
 * Body: {}
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
 * Body: {}
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

export default mediaRouter
