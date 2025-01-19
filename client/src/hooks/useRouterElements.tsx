import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import VerifyEmail from '../utils/VerifyEmail'

export default function useRouterElements() {
  const routeElements = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/login/oauth', element: <Login /> },
    { path: '/verify-email', element: <VerifyEmail /> }
  ])

  return routeElements
}
