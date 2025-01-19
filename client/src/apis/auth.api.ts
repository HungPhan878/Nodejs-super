import http from '../utils/http'

export const verifyEmail = (
  body: { email_verify_token: string },
  signal: AbortSignal
) => http.post('users/verify-email', body, { signal })
