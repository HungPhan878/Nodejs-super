import { Server } from 'socket.io'
import { UserVerifyStatus } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatusCode'
import MESSAGES_ERROR from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
// import Conversation from './models/schemas/Conversation.schema '
// import { verifyAccessToken } from './utils/common'
// import { TokenPayload } from './models/requests/User.requests'
// import { UserVerifyStatus } from './constants/enums'
// import { ErrorWithStatus } from './models/Errors'
// import MESSAGES_ERROR from './constants/messages'
// import HTTP_STATUS from './constants/httpStatusCode'
import dbService from '~/services/database.services'
import { verifyAccessToken } from './common'
import { TokenPayload } from '~/models/requests/User.requests'
import Conversation from '~/models/schemas/Conversation.schema'
import { Server as ServerHttp } from 'http'

const initialSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    /* Grant permission for localhost:3000 access */
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  // Socket io
  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}
  // Middleware socket io
  io.use(async (socket, next) => {
    console.log(socket.id, socket.handshake.auth)
    const { Authorization } = socket.handshake.auth
    const accessToken = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(accessToken)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: MESSAGES_ERROR.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      //Transmit decoded authorization for other middlewares
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = accessToken
      next() // next when not error
    } catch (error) {
      next({
        message: 'UnAuthorized',
        name: 'UnAuthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    // B1: Save user_id in object easy to manage
    users[user_id] = {
      socket_id: socket.id
    }
    console.log({ users })

    // Middleware for socket run every time send message
    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })
    // Listening error
    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    //B2: receive message from client 1 and send client 2
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id
      console.log({ receiver_id, receiver_socket_id })

      //Save message to database
      const conversation = new Conversation({
        sender_id, // socket translated from id to object id
        receiver_id,
        content
      })
      const result = await dbService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', {
          payload: conversation
        })
      }
    })
    socket.on('disconnect', () => {
      //B1: Remove users when user has disconnected
      delete users[user_id]
      console.log(`User ${socket.id} disconnected`)
      console.log({ users })
    })
  })
}

export default initialSocket
