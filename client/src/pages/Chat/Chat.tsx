import { useContext, useEffect, useState } from 'react'
import socket from '../../utils/socket'
import { AppContext } from '../../contexts/app.context'

export default function Chat() {
  const { profile } = useContext(AppContext)
  const [value, setValue] = useState<string>('')
  const [messages, setMessages] = useState<
    { content: string; isSend: boolean }[]
  >([])
  useEffect(() => {
    // B1: Authenticate user id and connect to socket of server
    socket.auth = {
      _id: profile._id
    }
    socket.connect()
    socket.on('receive private message', (data) => {
      const content = data.content as string
      setMessages((messages) => [
        ...messages,
        {
          content,
          isSend: false
        }
      ])
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
    setMessages((messages) => [
      ...messages,
      {
        content: value,
        isSend: true
      }
    ])
  }

  return (
    <div className='h-screen bg-gray-900 flex flex-col text-white'>
      {/* Header */}
      <header className='p-4 bg-gray-800 shadow-md text-center text-xl font-bold'>
        Chat
      </header>

      {/* Messages Section */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[70%] w-fit p-3 rounded-2xl  leading-normal shadow-md break-words ${
              message.isSend
                ? 'bg-blue-500 text-white ml-auto' // send
                : 'bg-gray-700 text-white mr-auto' // receive
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className='p-4 bg-gray-800 flex items-center gap-3'
      >
        <input
          type='text'
          className='flex-1 px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Nhập tin nhắn...'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type='submit'
          className='px-5 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition'
        >
          Gửi
        </button>
      </form>
    </div>
  )
}
