/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react'
import { getAccessTokenFromLS } from '../utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

const initialValue: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setAuthenticated: () => null
}
export const AppContext = createContext<AppContextInterface>(initialValue)

function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(initialValue.isAuthenticated)
  return <AppContext.Provider value={{ isAuthenticated, setAuthenticated }}>{children}</AppContext.Provider>
}

export default AppProvider
