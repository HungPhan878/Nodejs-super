import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

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
const file = fs.readFileSync(path.resolve('uploads/images/temp/investor.jpeg'))
const parallelUploads3 = new Upload({
  client: s3,
  params: {
    Bucket: 'twitter-clone-2025-ap-southeast-1',
    Key: 'anh.jpg', // Change name to 'anh.jpg when uploaded
    Body: file,
    ContentType: 'image/jpeg' // Use to show image on website instead download
  },
  tags: [
    /*...*/
  ], // optional tags
  queueSize: 4, // optional concurrency configuration
  partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
  leavePartsOnError: false // optional manually handle dropped parts
})
parallelUploads3.on('httpUploadProgress', (progress) => {
  console.log(progress)
})
parallelUploads3.done().then((res) => {
  console.log(res)
})
