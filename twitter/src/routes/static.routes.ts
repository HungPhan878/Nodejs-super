import { Router } from 'express'
import { staticController } from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', staticController)

export default staticRouter
