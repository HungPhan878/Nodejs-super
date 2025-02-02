import { useContext, useEffect, useState } from 'react'
import socket from '../../utils/socket'
import { AppContext } from '../../contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import { getConversation } from '../../apis/conversation.api'

const LIMIT = 10
const PAGE = 1
const usernames = [
  {
    _id: '678928a313683d4090dbbd75',
    username: 'User 1'
  },
  {
    _id: '6789f96c54f8cd1b1bbb3bbe',
    username: 'User 2'
  }
]
export default function Chat() {
  const { profile } = useContext(AppContext)
  const [value, setValue] = useState<string>('')
  const [conversations, setConversations] = useState<
    {
      content: string
      sender_id: string
      receiver_id: string
      _id: string | number
    }[]
  >([])
  const [receiver, setReceiver] = useState<string>('')
  const params = {
    limit: LIMIT,
    page: PAGE
  }

  useEffect(() => {
    // B1: Authenticate user id and connect to socket of server
    socket.auth = {
      _id: profile._id
    }
    socket.connect()
    socket.on('receive_message', (data) => {
      const { payload } = data
      setConversations((conversations) => [...conversations, payload])
    })

    socket.on('disconnect', () => {
      console.log(`${socket.id} is disconnected`)
    })
    // disconnect when remove component
    return () => {
      socket.disconnect()
    }
  }, [])

  // Get conversation query
  const getConversationsQuery = useQuery({
    queryKey: ['conversations', receiver, params],
    queryFn: () => getConversation(receiver as string, params),
    enabled: Boolean(receiver)
  })
  const conversationsData = getConversationsQuery.data?.data.result
  console.log(conversationsData)
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData.conversations)
    }
  }, [conversationsData])

  // Handler function
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValue('')
    const conversation = {
      content: value,
      sender_id: profile._id,
      receiver_id: receiver
    }
    socket.emit('send_message', {
      payload: conversation
    })
    setConversations((conversations) => [
      ...conversations,
      {
        ...conversation,
        _id: new Date().getTime()
      }
    ])
  }

  return (
    <div className='h-screen bg-gray-900 flex flex-col text-white'>
      {/* Header */}
      <header className='p-4 bg-gray-800 shadow-md text-center text-xl font-bold'>
        Chat
      </header>

      {/* Receiver */}
      {usernames.map((user) => (
        <button
          key={user._id}
          onClick={() => setReceiver(user._id)}
          className='p-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition'
        >
          {user.username}
        </button>
      ))}

      {/* Messages Section */}
      <div className='flex-1 overflow-y-auto p-4 space-y-3'>
        {(conversations ?? []).map((conversation, index) => (
          <div
            key={index}
            className={`max-w-[70%] w-fit p-3 rounded-2xl  leading-normal shadow-md break-words ${
              conversation?.sender_id && conversation.sender_id === profile._id
                ? 'bg-blue-500 text-white ml-auto' // send
                : 'bg-gray-700 text-white mr-auto' // receive
            }`}
          >
            <p>{conversation?.content}</p>
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
