import { Router } from 'express'
import {
  serveImageController,
  serveM3B4Controller,
  serveSegmentController,
  serveVideoStreamController
} from '~/controllers/medias.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/stream-video/:name', serveVideoStreamController)
staticRouter.get('/video-hls/:id/master.m3u8', serveM3B4Controller)
staticRouter.get('/video-hls/:id/:v/:segment', serveSegmentController)

export default staticRouter
