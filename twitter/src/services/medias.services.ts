import { Request } from 'express'
// import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import { envConfig, isProduction } from '~/constants/config'
import { UPLOAD_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { getNameToUrlName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import queue from '~/utils/queue'
import dbService from './database.services'
import { uploadFileToS3 } from '~/utils/s3'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediaService {
  async handleUploadImage(req: Request) {
    const mime = (await import('mime')).default
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameToUrlName(file.newFilename)
        const fileFullName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_DIR, fileFullName)
        sharp.cache(false)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          fileName: 'images/' + fileFullName,
          filePath: newPath,
          contentType: mime.getType(newPath) as string
        })
        //Delete the file upload after has been changed file.jpeg
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newName}.jpg`
        //     : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
        //   type: MediaType.Image
        // }
      })
    )

    return result
  }

  async uploadVideo(req: Request) {
    const mime = (await import('mime')).default
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        // const newName = getNameToUrlName(file.newFilename)
        const s3Result = await uploadFileToS3({
          fileName: 'videos/' + file.newFilename,
          filePath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })

        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/video/${newName}`
        //     : `http://localhost:${process.env.PORT}/static/video/${newName}`,
        //   type: MediaType.Video
        // }
      })
    )
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
            ? `${envConfig.host}/static/video-hls/${newName}/master.m3u8`
            : `http://localhost:${envConfig.port}/static/video-hls/${newName}/master.m3u8`,
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
