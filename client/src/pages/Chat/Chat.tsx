import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function Chat() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_URL_API)
    socket.on('connect', () => {
      console.log(`${socket.id} is connected`)

      // receive message from server
      socket.on('hello', (arg) => {
        console.log('Received message:', arg)
      })
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} is disconnected`)
    })
    // disconnect when remove component
    return () => {
      socket.disconnect()
    }
  }, [])

  return <div>Chat</div>
}
