import { EncodingStatus } from '~/constants/enums'

interface VideoStatusType {
  _id?: string
  status: EncodingStatus
  name: string
  message?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class VideoStatus {
  _id?: string
  status: EncodingStatus
  name: string
  message?: string
  createdAt?: Date
  updatedAt?: Date
  constructor(data: VideoStatusType) {
    const date = new Date()
    this._id = data._id
    this.status = data.status
    this.name = data.name
    this.message = data.message || ''
    this.createdAt = data.createdAt || date
    this.updatedAt = data.updatedAt || date
  }
}
