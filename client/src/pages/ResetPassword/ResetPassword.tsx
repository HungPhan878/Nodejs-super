import { useLocation } from 'react-router-dom'

export default function ResetPassword() {
  const { state } = useLocation()
  console.log(state)
  return <div>ResetPassword</div>
}
