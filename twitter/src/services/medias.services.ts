import { config } from 'dotenv'
import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { isProduction } from '~/constants/config'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameToUrlName, handleUploadSingleImage } from '~/utils/file'

config()
class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameToUrlName(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    sharp.cache(false)
    await sharp(file.filepath).jpeg().toFile(newPath)
    // Delete the file upload after has been changed file.jpg
    fs.unlinkSync(file.filepath)
    return isProduction
      ? `${process.env.HOST}/static/${newName}.jpg`
      : `http://localhost:${process.env.PORT}/static/${newName}.jpg`
  }
}

const mediaService = new MediaService()
export default mediaService
