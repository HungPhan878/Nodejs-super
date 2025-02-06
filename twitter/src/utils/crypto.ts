import { createHash } from 'node:crypto'
import { envConfig } from '~/constants/config'

export function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  // ADD key secret to increase security
  return sha256(password + envConfig.passwordSecret)
}
