import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import useQueryParams from '../../hooks/useQueryParams'
import { forgotPassword } from '../../apis/auth.api'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
  const { token } = useQueryParams()
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Url: '/forgot-password'
  // Method: POST
  const verifyEmailMutation = useMutation({
    mutationFn: ({
      body,
      signal
    }: {
      body: { forgot_password_token: string }
      signal: AbortSignal
    }) => forgotPassword(body, signal)
  })

  useEffect(() => {
    const controller = new AbortController()

    if (token) {
      verifyEmailMutation.mutate(
        { body: { forgot_password_token: token }, signal: controller.signal },
        {
          onSuccess: (res) => {
            const { data } = res
            console.log(data)
            setMessage(data.message)
            navigate('/reset-password', {
              state: { forgot_password_token: token }
            })
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
