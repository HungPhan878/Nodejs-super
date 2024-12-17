import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameToUrlName, handleUploadSingleImage } from '~/utils/file'

class MediaService {
  async handleUploadSingleImage(req: Request) {
    const file = await handleUploadSingleImage(req)
    const newName = getNameToUrlName(file.newFilename)
    const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
    await sharp(file.filepath).jpeg().toFile(newPath)
    // Delete the file upload after has been changed file.jpg
    fs.unlinkSync(file.filepath)
    return `http://localhost:3000/uploads/${newName}.jpg`
  }
}

const mediaService = new MediaService()
export default mediaService
