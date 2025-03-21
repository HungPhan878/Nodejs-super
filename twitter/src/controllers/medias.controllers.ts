import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { UPLOAD_DIR, UPLOAD_DIR_VIDEO } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR from '~/constants/messages'
import mediaService from '~/services/medias.services'
import { sendFileFromS3 } from '~/utils/s3'
export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadImage(req)
  res.status(200).json({
    message: MESSAGES_ERROR.IMAGE_UPLOADED_SUCCESSFULLY,
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const result = await mediaService.uploadVideo(req)
  res.status(200).json({
    message: MESSAGES_ERROR.VIDEO_UPLOADED_SUCCESSFULLY,
    result
  })
}

export const uploadVideoHlsController = async (req: Request, res: Response) => {
  const result = await mediaService.uploadVideoHls(req)
  res.status(200).json({
    message: MESSAGES_ERROR.VIDEO_UPLOADED_SUCCESSFULLY,
    result
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const nameImage = req.params.name
  res.sendFile(path.resolve(UPLOAD_DIR, nameImage), (err) => {
    if (err) {
      res.status((err as any).status).json({ message: MESSAGES_ERROR.IMAGE_NOT_FOUND })
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response): Promise<any> => {
  const mime = (await import('mime')).default
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }
  const name = req.params.name
  const videoPath = path.resolve(UPLOAD_DIR_VIDEO, name as string)
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 10 ** 6 // 1MB
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType,
    'Content-Length': contentLength
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}

export const serveM3B4Controller = (req: Request, res: Response) => {
  const { id } = req.params
  sendFileFromS3(res, `video-hls/${id}/master.m3u8`)
  // return res.sendFile(path.resolve(UPLOAD_DIR_VIDEO, id as string, 'master.m3u8'), (err) => {
  //   if (err) {
  //     res.status((err as any).status).send('NOT FOUND')
  //   }
  // })
}

export const serveSegmentController = async (req: Request, res: Response) => {
  const { id, v, segment } = req.params
  sendFileFromS3(res, `video-hls/${id}/${v}/${segment}`)
  // return res.sendFile(path.resolve(UPLOAD_DIR_VIDEO, id as string, v, segment), (err) => {
  //   if (err) {
  //     res.status((err as any).status).send('NOT FOUND')
  //   }
  // })
}

export const videoStatusController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await mediaService.getVideoStatus(id as string)
  res.status(200).json({ message: MESSAGES_ERROR.GET_STATUS_VIDEO_SUCCESSFULLY, result })
}
