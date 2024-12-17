import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import { UPLOAD_DIR_TEMP } from '~/constants/dir'

export const initFolder = () => {
  // fs is module in Node.js to do work with file system and folder, check paths exist or CRUD files
  if (!fs.existsSync(UPLOAD_DIR_TEMP)) {
    fs.mkdirSync(UPLOAD_DIR_TEMP, {
      recursive: true // have nested files
    })
  }
}

export const handleUploadSingleImage = async (req: Request) => {
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_DIR_TEMP,
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
  return new Promise<File>((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // If the file of image is empty
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('No image file found'))
      }
      resolve((files.image as File[])[0])
    })
  })
}

export const getNameToUrlName = (fullname: string) => {
  const nameArr = fullname.split('.')
  nameArr.pop()
  return nameArr.join('')
}
