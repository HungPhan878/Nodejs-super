import { Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import MESSAGES_ERROR from '~/constants/messages'
import mediaService from '~/services/medias.services'
export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediaService.handleUploadImage(req)
  res.status(200).json({
    message: MESSAGES_ERROR.IMAGE_UPLOADED_SUCCESSFULLY,
    result
  })
}

export const staticController = async (req: Request, res: Response) => {
  const nameImage = req.params.name
  res.sendFile(path.resolve(UPLOAD_DIR, nameImage), (err) => {
    if (err) {
      res.status((err as any).status).json({ message: MESSAGES_ERROR.IMAGE_NOT_FOUND })
    }
  })
}
