import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express'
import formidable from 'formidable'

export const initFolder = () => {
  // fs is module in Node.js to do work with file system and folder, check paths exist or CRUD files
  const uploadFilePath = path.resolve('uploads')
  if (!fs.existsSync(uploadFilePath)) {
    fs.mkdirSync(uploadFilePath, {
      recursive: true // have nested files
    })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 300 * 1024, //300kb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        //Only use form.emit is res err
        form.emit('error' as any, new Error('file type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // If the file of image is empty
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No image file found'))
      }
      resolve(files)
    })
  })
}
