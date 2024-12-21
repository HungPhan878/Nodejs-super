import reactLogo from '~/assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { removeTokenFromLS } from '../../utils/auth'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { Poster } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'

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
  const { isAuthenticated, setAuthenticated } = useContext(AppContext)
  // function handler
  const logoutHandler = () => {
    setAuthenticated(false)
    removeTokenFromLS()
  }
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
        {isAuthenticated ? (
          <>
            <>Welcome to my app</>
            <button className='bg-red-500 p-3 rounded-md' onClick={logoutHandler}>
              Logout
            </button>
            <h2>Video HLS</h2>
            <div className='w-96 h-96'>
              <MediaPlayer title='Sprite Fight' src='https://files.vidstack.io/sprite-fight/hls/stream.m3u8'>
                <Poster
                  className='vds-poster'
                  src='https://files.vidstack.io/sprite-fight/poster.webp'
                  alt='Girl walks into campfire with gnomes surrounding her friend ready for their next meal!'
                />
                <MediaProvider />
                <DefaultVideoLayout
                  thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
                  icons={defaultLayoutIcons}
                />
              </MediaPlayer>
            </div>
          </>
        ) : (
          <Link to={urlOauthGoogle} className='p-4 rounded-md bg-green-500'>
            Login with oauth google
          </Link>
        )}
      </div>
    </div>
  )
}
