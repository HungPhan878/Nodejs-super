import reactLogo from '~/assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
const getOauthGoogleUrl = () => {
  const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } = import.meta.env
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const query = {
    client_id: VITE_GOOGLE_CLIENT_ID,
    redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
    response_type: 'code',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(
      ' '
    ),
    access_type: 'offline',
    prompt: 'consent'
  }
  const qs = new URLSearchParams(query).toString()
  return `${rootUrl}?${qs}`
}
const urlOauthGoogle = getOauthGoogleUrl()
export default function Home() {
  return (
    <div className='w-full h-screen'>
      <div className='h-full flex flex-col items-center justify-center gap-10'>
        <div>
          <a href='https://vite.dev' target='_blank'>
            <img src={viteLogo} className='logo' alt='Vite logo' />
          </a>
          <a href='https://react.dev' target='_blank'>
            <img src={reactLogo} className='logo react' alt='React logo' />
          </a>
        </div>
        <h1>Oauth Google</h1>
        <Link to={urlOauthGoogle} className='p-4 rounded-md bg-green-500'>
          Login with oauth google
        </Link>
        <p className='read-the-docs'>Click on the Vite and React logos to learn more</p>
      </div>
    </div>
  )
}
