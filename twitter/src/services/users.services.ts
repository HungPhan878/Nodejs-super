import User from '~/models/schemas/user.schema'
import dbService from '~/services/database.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'

class UserService {
  async createUser(payload: RegisterBodyReq) {
    const result = await dbService.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    return result
  }

  async checkEmailExist(value: string) {
    const result = await dbService.users.findOne({ email: value })
    //or boolean(result)
    return !!result
  }
}

const userService = new UserService()
export default userService
