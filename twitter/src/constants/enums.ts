export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenTypes {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  VerifiedEmailToken
}

export enum MediaType {
  Image,
  Video,
  HLS
}

export enum MediaQueryType {
  Image = 'image',
  Video = 'video'
}

export enum EncodingStatus {
  Pending, // Waiting the queue
  Processing, // Encoding
  Success, // Encoded is successful
  Failed // Encoded is failed
}

export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}
export enum TweetTypes {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum PeopleFollowedType {
  Anyone = '0',
  Followings = '1'
}
