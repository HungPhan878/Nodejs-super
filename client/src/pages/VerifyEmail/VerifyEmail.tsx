import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import useQueryParams from '../../hooks/useQueryParams'
import { AppContext } from '../../contexts/app.context'
import { verifyEmail } from '../../apis/auth.api'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../../utils/auth'

export default function VerifyEmail() {
  const { token } = useQueryParams()
  const [message, setMessage] = useState('')
  const { setAuthenticated } = useContext(AppContext)

  // Url: '/verify-email'
  // Method: POST
  const verifyEmailMutation = useMutation({
    mutationFn: ({
      body,
      signal
    }: {
      body: { email_verify_token: string }
      signal: AbortSignal
    }) => verifyEmail(body, signal)
  })

  useEffect(() => {
    const controller = new AbortController()

    if (token) {
      verifyEmailMutation.mutate(
        { body: { email_verify_token: token }, signal: controller.signal },
        {
          onSuccess: (res) => {
            const { data } = res
            console.log(data)
            setMessage(data.message)
            setAuthenticated(true)
            setAccessTokenToLS(data.result.access_token)
            setRefreshTokenToLS(data.result.refresh_token)
          },
          onError: (error) => {
            const data = error?.response?.data
            setMessage(data.message)
          }
        }
      )
    }
    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  return <div className='flex justify-center'>{message}</div>
}
