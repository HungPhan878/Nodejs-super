export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const removeTokenFromLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refresh_token', refreshToken)
}

export const getRefreshTokenFromLS = () => {
  return localStorage.getItem('refresh_token') || ''
}
