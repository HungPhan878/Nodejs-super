import { Request, Response, NextFunction } from 'express'
import formidable from 'formidable'
import path from 'path'
export const uploadSingleImageController = (req: Request, res: Response) => {
  // const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: path.resolve('uploads'),
    keepExtensions: true,
    maxFiles: 1,
    maxFileSize: 300 * 1024
  })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      throw err
    }
    res.status(200).json({ message: 'Image uploaded successfully' })
  })
}
