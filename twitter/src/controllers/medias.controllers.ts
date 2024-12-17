import { Request, Response, NextFunction } from 'express'
import MESSAGES_ERROR from '~/constants/messages'
import mediaService from '~/services/medias.services'
export const uploadSingleImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadSingleImage(req)
  res.status(200).json({
    message: MESSAGES_ERROR.IMAGE_UPLOADED_SUCCESSFULLY,
    result
  })
}
