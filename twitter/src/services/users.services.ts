import User from '~/models/schemas/user.schema'
import dbService from '~/services/database.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenTypes } from '~/constants/enums'
import { signToken } from '~/utils/jwt'

class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.AccessToken },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.RefreshToken },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }
  async createUser(payload: RegisterBodyReq) {
    const result = await dbService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // Because insertedId have objectId type so we need to translate it into a string
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId)
    ])
    return {
      accessToken,
      refreshToken
    }
  }

  async checkEmailExist(value: string) {
    const result = await dbService.users.findOne({ email: value })
    //or boolean(result)
    return !!result
  }
}

const userService = new UserService()
export default userService
