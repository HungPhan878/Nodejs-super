/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'
import { getAccessTokenFromLS, getProfileFromLS } from '../utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProfile: React.Dispatch<React.SetStateAction<any>>
}

const initialValue: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null
}
export const AppContext = createContext<AppContextInterface>(initialValue)

function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    initialValue.isAuthenticated
  )
  const [profile, setProfile] = useState(initialValue.profile)
  return (
    <AppContext.Provider
      value={{ isAuthenticated, setAuthenticated, profile, setProfile }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
