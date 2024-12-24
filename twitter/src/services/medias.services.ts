import { config } from 'dotenv'
import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { isProduction } from '~/constants/config'
import { UPLOAD_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Orther'
import { getNameToUrlName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import queue from '~/utils/queue'
import dbService from './database.services'

config()
class MediaService {
  async handleUploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameToUrlName(file.newFilename)
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        // Delete the file upload after has been changed file.jpg
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )

    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      const newName = getNameToUrlName(file.newFilename)
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${newName}`
          : `http://localhost:${process.env.PORT}/static/video/${newName}`,
        type: MediaType.Video
      }
    })
    return result
  }

  async uploadVideoHls(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameToUrlName(file.newFilename)
        // Add video into the queue to perform encode in order
        queue.enQueue(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}/master.m3u4`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}/master.m3u4`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }

  async getVideoStatus(id: string) {
    const data = await dbService.videoStatus.findOne({ name: id })
    return data
  }
}

const mediaService = new MediaService()
export default mediaService
