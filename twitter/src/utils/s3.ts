/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'
import { Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR from '~/constants/messages'

config()

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

// listBuckets use to test connect S3 success or failure
// s3.listBuckets({}).then((data) => console.log(data))
// const file = fs.readFileSync(path.resolve('uploads/images/temp/3d40afab00b25230f97e0ee00.jpeg'))
export const uploadFileToS3 = ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileName, // Change name to 'anh.jpg when uploaded
      Body: fs.readFileSync(filePath),
      ContentType: contentType // Use to show image on website instead download
    },
    tags: [
      /*...*/
    ], // optional tags
    queueSize: 4, // optional concurrency configuration
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
    leavePartsOnError: false // optional manually handle dropped parts
  })
  return parallelUploads3.done()
}

export const sendFileFromS3 = async (res: Response, filePath: string) => {
  try {
    const data = await s3.getObject({
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: filePath // path to the bucket at S3 bucket
    })
    ;(data.Body as any).pipe(res)
  } catch (error) {
    res.status(HTTP_STATUS.NOT_FOUND).send(MESSAGES_ERROR.VIDEO_NOT_FOUND)
  }
}

// parallelUploads3.on('httpUploadProgress', (progress) => {
//   console.log(progress)
// })
// parallelUploads3.done().then((res) => {
//   console.log(res)
// })
