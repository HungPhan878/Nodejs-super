import dbService from '~/services/database.services'
import { encodeHLSWithMultipleVideoStreams } from './video'
import fsPromise from 'fs/promises'
import { getNameToUrlName } from './file'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import { EncodingStatus } from '~/constants/enums'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  async enQueue(item: string) {
    this.items.push(item)
    // const item = /home/duy/Downloads/12312312/1231231221.mp4
    const idName = getNameToUrlName(item.split('\\').pop() as string)
    console.log({ idName, item })
    await dbService.videoStatus.insertOne(
      new VideoStatus({
        name: idName,
        status: EncodingStatus.Pending
      })
    )
    this.processEncode()
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      const idName = getNameToUrlName(videoPath.split('\\').pop() as string)
      await dbService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        await fsPromise.unlink(videoPath)
        this.items.shift()
        await dbService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updatedAt: true
            }
          }
        )
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
        await dbService.videoStatus
          .updateOne(
            { name: idName },
            {
              $set: {
                status: EncodingStatus.Failed
              },
              $currentDate: {
                updatedAt: true
              }
            }
          )
          .catch((error) => console.error('Update video status error', error))

        console.error(`Encode video ${videoPath} failed`)
        console.error(error)
      }
      this.encoding = false
      this.processEncode()
    } else {
      console.log('No video to encode')
    }
  }
}
const queue = new Queue()
export default queue
