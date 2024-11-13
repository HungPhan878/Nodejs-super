import User from '~/models/schemas/user.schema'
import dbService from '~/services/database.services'

class UserService {
  async createUser(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await dbService.users.insertOne(new User({ email, password }))
    return result
  }
}

const userService = new UserService()
export default userService
