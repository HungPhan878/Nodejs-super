import User from '~/models/schemas/user.schema'
import dbService from '~/services/database.services'
import { RegisterBodyReq } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { signToken } from '~/utils/jwt'
import { config } from 'dotenv'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'

config()
class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.AccessToken },
      privateKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.RefreshToken },
      privateKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private emailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.VerifiedEmailToken },
      privateKey: process.env.JWT_EMAIL_VERIFY_TOKEN_SECRET as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async createUser(payload: RegisterBodyReq) {
    const user_id = new ObjectId()
    const email_verify_token = await this.emailVerifyToken(user_id.toString())
    await dbService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // Because insertedId have objectId type so we need to translate it into a string
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id.toString())
    await dbService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
    )
    console.log('email-verify-token:', email_verify_token)
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

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(userId)
    await dbService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async logout(refresh_token: string) {
    const result = await dbService.refreshToken.deleteOne({ token: refresh_token })
    return result
  }

  async refreshToken(user_id: string, refresh_token: string) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id),
      dbService.refreshToken.deleteOne({ token: refresh_token })
    ])
    await dbService.refreshToken.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
    )
    return {
      new_access_token,
      new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken(user_id),
      dbService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            verify: UserVerifyStatus.Verified,
            email_verify_token: '',
            updated_at: new Date()
          }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }
}

const userService = new UserService()
export default userService
