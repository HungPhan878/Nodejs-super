import http from '../utils/http'

export const getProfile = () => {
  return http.get('/users/me')
}
