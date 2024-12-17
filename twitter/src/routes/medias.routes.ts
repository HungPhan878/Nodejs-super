import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const mediaRouter = Router()

/**
 * Description: Upload a image file
 * Path: /upload-image
 * Method: POST
 * Body: {}
 */
mediaRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediaRouter
