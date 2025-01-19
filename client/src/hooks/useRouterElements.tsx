import { useRoutes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import VerifyEmail from '../pages/VerifyEmail'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'

export default function useRouterElements() {
  const routeElements = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/login/oauth', element: <Login /> },
    { path: '/verify-email', element: <VerifyEmail /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/reset-password', element: <ResetPassword /> }
  ])

  return routeElements
}
