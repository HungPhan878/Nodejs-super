import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const mediaRouter = Router()

/**
 * Description: Upload a image file
 * Path: /upload-image
 * Method: POST
 * Body: {}
 */
mediaRouter.post('/upload-image', wrapRequestHandler(uploadSingleImageController))

export default mediaRouter
