import { Request, Response, NextFunction } from 'express'
import { handleUploadSingleImage } from '~/utils/file'
export const uploadSingleImageController = async (req: Request, res: Response) => {
  const data = await handleUploadSingleImage(req)
  res.status(200).json({
    message: 'Image uploaded successfully',
    result: data
  })
}
