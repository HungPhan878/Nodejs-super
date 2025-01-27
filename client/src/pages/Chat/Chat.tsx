import { useContext, useEffect, useState } from 'react'
import socket from '../../utils/socket'
import { AppContext } from '../../contexts/app.context'

export default function Chat() {
  const { profile } = useContext(AppContext)
  const [value, setValue] = useState<string>('')
  const [messages, setMessages] = useState<string[]>([])
  useEffect(() => {
    // B1: Authenticate user id and connect to socket of server
    socket.auth = {
      _id: profile._id
    }
    socket.connect()
    socket.on('receive private message', (data) => {
      const content = data.content as string
      setMessages((messages) => [...messages, content])
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} is disconnected`)
    })
    // disconnect when remove component
    return () => {
      socket.disconnect()
    }
  }, [])

  // Handler function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValue('')
    socket.emit('private message', {
      content: value,
      to: '6789f96c54f8cd1b1bbb3bbe' // user_id of Client 2
    })
  }

  return (
    <div>
      <h1 className='text-3xl'>Chat</h1>
      <div>
        {messages.map((message, index) => {
          return (
            <div key={index}>
              <p>{message}</p>
            </div>
          )
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className='h-60 flex flex-col gap-2 justify-end items-center'
      >
        <input
          type='text'
          className='px-4 py-4 h-4 border-2 border-red-500 rounded-md'
          placeholder='Enter your message'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type='submit' className='p-5 bg-blue-500 rounded-lg'>
          Send
        </button>
      </form>
    </div>
  )
}
