import http from '../utils/http'

export const verifyEmail = (
  body: { email_verify_token: string },
  signal: AbortSignal
) => http.post('users/verify-email', body, { signal })

export const forgotPassword = (
  body: { forgot_password_token: string },
  signal: AbortSignal
) => http.post('users/verify-forgot-password', body, { signal })
