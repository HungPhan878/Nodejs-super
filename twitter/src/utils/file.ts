import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { UPLOAD_DIR_TEMP, UPLOAD_DIR_TEMP_VIDEO, UPLOAD_DIR_VIDEO } from '~/constants/dir'
import path from 'path'

export const initFolder = () => {
  ;[UPLOAD_DIR_TEMP, UPLOAD_DIR_TEMP_VIDEO].forEach((dir) => {
    // fs is module in Node.js to do work with file system and folder, check paths exist or CRUD files
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // have nested files
      })
    }
  })
}

export const handleUploadImage = async (req: Request) => {
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_DIR_TEMP,
    keepExtensions: true,
    maxFiles: 4,
    maxFileSize: 300 * 1024, //300kb
    maxTotalFileSize: 300 * 1024 * 4, //1200kb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        //Only use form.emit is res err
        form.emit('error' as any, new Error('file type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // If the file of image is empty
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No image file found'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  // Create unique Id from beginning of video file
  const nanoId = (await import('nanoId')).nanoid
  const name = nanoId()
  const folderPath = path.resolve(UPLOAD_DIR_VIDEO, name)
  fs.mkdirSync(folderPath)
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFileSize: 50 * 1024 * 1024, //50MB
    filter: function ({ name, originalFilename, mimetype }) {
      return true
    },
    filename() {
      return name
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // If the file of image is empty
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('No video file found'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = `${video.newFilename}.${ext}`
        video.filepath = video.filepath + '.' + ext
      })
      resolve(files.video as File[])
    })
  })
}

export const getNameToUrlName = (fullname: string) => {
  const nameArr = fullname.split('.')
  nameArr.pop()
  return nameArr.join('')
}

export const getExtension = (fullname: string) => {
  const nameArr = fullname.split('.')
  return nameArr[nameArr.length - 1]
}
