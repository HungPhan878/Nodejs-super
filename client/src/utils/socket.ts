import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_URL_API)
// const socket = io(import.meta.env.VITE_URL_API, {
//   auth: {
//     Authorization: `Bearer ${getAccessTokenFromLS()}`
//   }
// })
// When initial io simultaneous connected and bring Authorization to server
export default socket
