/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '../utils/http'

export const getConversation = (
  receiver_id: string,
  params?: Record<string, any>
) => {
  return http.get<{ message: string; result: any }>(
    `/conversations/receivers/${receiver_id}`,
    { params }
  )
}
