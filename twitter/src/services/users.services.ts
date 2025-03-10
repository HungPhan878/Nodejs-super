import User from '~/models/schemas/user.schema'
import dbService from '~/services/database.services'
import { RegisterBodyReq, UpdateMeBodyReq } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { TokenTypes, UserVerifyStatus } from '~/constants/enums'
import { signToken, verifyToken } from '~/utils/jwt'
import { RefreshToken } from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import MESSAGES_ERROR from '~/constants/messages'
import axios from 'axios'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatusCode'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/email'
import { envConfig } from '~/constants/config'

class UserService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.AccessToken, verify },
      privateKey: envConfig.jwtSecretAccessToken as string,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }

  private signRefreshToken({
    user_id,
    verify,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
  }) {
    if (exp) {
      return signToken({
        payload: { user_id, token_type: TokenTypes.RefreshToken, verify, exp },
        privateKey: envConfig.jwtSecretRefreshToken as string
      })
    }
    return signToken({
      payload: { user_id, token_type: TokenTypes.RefreshToken, verify },
      privateKey: envConfig.jwtSecretRefreshToken as string,
      options: {
        expiresIn: envConfig.refreshTokenExpiresIn
      }
    })
  }

  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.VerifiedEmailToken, verify },
      privateKey: envConfig.jwtSecretEmailVerifyToken as string,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }

  private signForgotPasswordToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.ForgotPasswordToken, verify },
      privateKey: envConfig.jwtSecretForgotPasswordToken as string,
      options: {
        expiresIn: envConfig.forgotPasswordTokenExpiresIn
      }
    })
  }

  private signAccessAndRefreshToken({
    user_id,
    verify
  }: {
    user_id: string
    verify: UserVerifyStatus
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify })
    ])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken as string
    })
  }

  async createUser(payload: RegisterBodyReq) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    await dbService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    // Because insertedId have objectId type so we need to translate it into a string
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
    // decode the refresh token
    const decodedRefreshToken = await this.decodeRefreshToken(refreshToken)
    // save refresh token to database
    await dbService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken,
        exp: decodedRefreshToken.exp,
        iat: decodedRefreshToken.iat
      })
    )
    // Flow verify email
    // 1. Server send email to user
    // 2. User click link in email
    // 3. Client send request to server with email_verify_token
    // 4. Server verify email_verify_token
    // 5. Client receive access_token and refresh_token
    await sendVerifyRegisterEmail(payload.email, email_verify_token)
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

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({ user_id, verify })
    // decode the refresh token
    const decodedRefreshToken = await this.decodeRefreshToken(refreshToken)
    await dbService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken,
        exp: decodedRefreshToken.exp,
        iat: decodedRefreshToken.iat
      })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: envConfig.googleClientId,
      client_secret: envConfig.googleClientSecret,
      redirect_uri: envConfig.googleRedirectUri,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getOauthGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: { access_token, alt: 'json' },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async oauth(code: string) {
    const { access_token, id_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getOauthGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: MESSAGES_ERROR.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    //Check if the user registered
    const user = await dbService.users.findOne({ email: userInfo.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })

      return {
        access_token,
        refresh_token,
        verify: user.verify,
        new_user: 0
      }
    } else {
      //Register user
      const password = Math.random().toString(36).substring(2, 15)
      const data = await this.createUser({
        name: userInfo.name,
        password,
        confirm_password: password,
        email: userInfo.email,
        date_of_birth: new Date().toISOString()
      })
      return {
        access_token: data.accessToken,
        refresh_token: data.refreshToken,
        verify: UserVerifyStatus.Unverified,
        new_user: 1
      }
    }
  }

  async logout(refresh_token: string) {
    const result = await dbService.refreshToken.deleteOne({ token: refresh_token })
    return result
  }

  async refreshToken({
    user_id,
    refresh_token,
    verify,
    exp
  }: {
    user_id: string
    refresh_token: string
    verify: UserVerifyStatus
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify }),
      this.signRefreshToken({ user_id, verify, exp }),
      dbService.refreshToken.deleteOne({ token: refresh_token })
    ])
    // decode the refresh token
    const decodedRefreshToken = await this.decodeRefreshToken(new_refresh_token)
    await dbService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        exp,
        iat: decodedRefreshToken.iat
      })
    )
    return {
      new_access_token,
      new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      dbService.users.updateOne({ _id: new ObjectId(user_id) }, [
        {
          $set: {
            verify: UserVerifyStatus.Verified,
            email_verify_token: '',
            updated_at: '$$NOW'
          }
        }
      ])
    ])
    const [access_token, refresh_token] = token
    // decode the refresh token
    const decodedRefreshToken = await this.decodeRefreshToken(refresh_token)
    await dbService.refreshToken.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refresh_token,
        exp: decodedRefreshToken.exp,
        iat: decodedRefreshToken.iat
      })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async resendVerifyEmail(user_id: string, email: string) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id,
      verify: UserVerifyStatus.Unverified
    })
    await sendVerifyRegisterEmail(email, email_verify_token)
    console.log('resend-email-verify-token:', email_verify_token)
    await dbService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: MESSAGES_ERROR.RESEND_VERIFY_EMAIL_SUCCESSFULLY,
      result: {
        message: 'Token included for Swagger testing purposes only',
        email_verify_token
      }
    }
  }

  async forgotPassword({
    user_id,
    verify,
    email
  }: {
    user_id: string
    verify: UserVerifyStatus
    email: string
  }) {
    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await dbService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    //Send email attachment Link https://twitter.com/forgot-password?token=value  to  client
    await sendForgotPasswordEmail(email, forgot_password_token)
    return {
      message: MESSAGES_ERROR.CHECK_EMAIL_SUCCESSFULLY,
      result: {
        message: 'Token included for Swagger testing purposes only',
        forgot_password_token
      }
    }
  }

  async resetPassword(user_id: string, new_password: string) {
    await dbService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password),
          forgot_password_token: ''
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: MESSAGES_ERROR.RESET_PASSWORD_SUCCESSFULLY
    }
  }

  async getMe(user_id: string) {
    const user = await dbService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMe(user_id: string, payload: UpdateMeBodyReq) {
    const _payload = payload.date_of_birth ? new Date(payload.date_of_birth) : payload
    const user = await dbService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(_payload as UpdateMeBodyReq & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async getProfileUser(username: string) {
    const user = await dbService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    return user
  }

  async followUser(user_id: string, followed_user_id: string) {
    const follower = await dbService.followers.findOne({
      followed_user_id: new ObjectId(followed_user_id),
      user_id: new ObjectId(user_id)
    })
    if (follower === null) {
      await dbService.followers.insertOne({
        user_id: new ObjectId(user_id),
        followed_user_id: new ObjectId(followed_user_id)
      })
      return { message: MESSAGES_ERROR.FOLLOW_SUCCESS }
    }
    return { message: MESSAGES_ERROR.FOLLOWED }
  }

  async unFollowUser(user_id: string, followed_user_id: string) {
    const follower = await dbService.followers.findOne({
      followed_user_id: new ObjectId(followed_user_id),
      user_id: new ObjectId(user_id)
    })
    //Not found user is throwing an notification unfollow or already unfollow
    if (follower === null) {
      return { message: MESSAGES_ERROR.ALREADY_UNFOLLOWED }
    }
    //Else delete the follower
    await dbService.followers.deleteOne({
      followed_user_id: new ObjectId(followed_user_id),
      user_id: new ObjectId(user_id)
    })
    return { message: MESSAGES_ERROR.UNFOLLOW_SUCCESS }
  }

  async changePassword(user_id: string, password: string) {
    await dbService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return { message: MESSAGES_ERROR.CHANGE_PASSWORD_SUCCESS }
  }

  async getListUsersToFollow({ limit, page }: { limit: number; page: number }) {
    const $sample = {
      size: 100
    }
    const [users, total] = await Promise.all([
      dbService.users
        .aggregate([
          {
            $sample
          },
          {
            $project: {
              forgot_password_token: 0,
              email_verify_token: 0,
              date_of_birth: 0,
              password: 0,
              twitter_circle: 0,
              verify: 0
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      dbService.users
        .aggregate([
          {
            $sample
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return { users, total: total[0]?.total || 0 }
  }
}

const userService = new UserService()
export default userService
