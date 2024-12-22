import { encodeHLSWithMultipleVideoStreams } from './video'
import fsPromise from 'fs/promises'

class Queue {
  items: string[]
  encoding: boolean
  constructor() {
    this.items = []
    this.encoding = false
  }
  enQueue(item: string) {
    this.items.push(item)
    this.processEncode()
    console.log('encode')
  }
  async processEncode() {
    if (this.encoding) return
    if (this.items.length > 0) {
      this.encoding = true
      const videoPath = this.items[0]
      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        await fsPromise.unlink(videoPath)
        this.items.shift()
        console.log(`Encode video ${videoPath} success`)
      } catch (error) {
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
