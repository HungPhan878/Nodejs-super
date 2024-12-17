import { Request, Response, NextFunction } from 'express'
import mediaService from '~/services/medias.services'
export const uploadSingleImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadSingleImage(req)
  res.status(200).json({
    message: 'Image uploaded successfully',
    result
  })
}
