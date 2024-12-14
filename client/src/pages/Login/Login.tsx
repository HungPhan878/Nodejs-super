import { useContext, useEffect } from 'react'
import useQueryParams from '../../hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { AuthRes } from '../../types/auth.type'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../../utils/auth'
import { AppContext } from '../../contexts/app.context'

export default function Login() {
  const queryParams: AuthRes = useQueryParams()
  const { setAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()
  // Use useEffect here because dom painting is run this callback
  useEffect(() => {
    setAccessTokenToLS(queryParams.access_token as string)
    setRefreshTokenToLS(queryParams.refresh_token as string)
    setAuthenticated(true)
    // ở đây mình chỉ test UI cho trường hợp login
    // Trường hợp register thì bạn nào biết Front-end React có thể tự làm thêm UI cho nó nhé
    // Dựa vào new_user, verify để biết là user mới hay user cũ và đã verify email hay chưa
    navigate('/')
  }, [navigate, setAuthenticated, queryParams.access_token, queryParams.refresh_token])

  return <div>Login</div>
}
