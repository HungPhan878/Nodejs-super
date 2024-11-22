import { config } from 'dotenv'
import { createHash } from 'node:crypto'

config()
export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  // ADD key secret to increase security
  return sha256(password + process.env.KEY_SECRET_PW)
}
