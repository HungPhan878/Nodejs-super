import fs from 'fs'
import path from 'path'

export const initFolder = () => {
  // fs is module in Node.js to do work with file system and folder, check paths exist or CRUD files
  const uploadFilePath = path.resolve('uploads')
  if (!fs.existsSync(uploadFilePath)) {
    fs.mkdirSync(uploadFilePath, {
      recursive: true // have nested files
    })
  }
}
