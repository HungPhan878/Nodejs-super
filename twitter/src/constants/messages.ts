const MESSAGES_ERROR = {
  INVALID_ERROR: 'Invalid validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Password length must be from 8 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 8-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Confirm password length must be from 8 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  USER_NOT_FOUND: 'User not found',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login successfully',
  REGISTER_SUCCESS: 'Register successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  USER_UPDATED_SUCCESSFULLY: 'User updated successfully',
  USER_UPDATED_WITH_ERRORS: 'User updated with errors',
  USER_DELETED_SUCCESSFULLY: 'User deleted successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_USED_OR_NOT_EXIST: 'Refresh token used or not exists',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_SUCCESSFULLY: 'Refresh token successfully',
  EMAIL_VERIFY_IS_REQUIRED: 'Email verify is required',
  EMAIL_VERIFY_IS_INVALID: 'Email verify is invalid',
  EMAIL_VERIFY_ALREADY_VERIFIED: 'Email verify already verified',
  EMAIL_VERIFY_SUCCESSFULLY: 'Email verify successfully',
  RESEND_VERIFY_EMAIL_SUCCESSFULLY: ' Resend verify email successfully',
  CHECK_EMAIL_SUCCESSFULLY: 'Check email successfully',
  RESET_PASSWORD_SUCCESSFULLY: 'Reset password successfully',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Reset password is required',
  FORGOT_PASSWORD_IS_INVALID: 'Reset password is invalid',
  RESET_PASSWORD_SUCCESSFULLY_UPDATED: 'Reset password successfully updated',
  RESET_PASSWORD_TOKEN_IS_REQUIRED: 'Reset password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  GET_ME_SUCCESSFULLY: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_STRING: 'Bio must be a string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be a string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be a string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'Username must be a string',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  USERNAME_EXISTED: 'Username existed',
  IMAGE_URL_MUST_BE_STRING: 'Avatar must be a string',
  IMAGE_URL_LENGTH: 'Avatar length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  FOLLOW_SUCCESS: 'Follow success',
  INVALID_USER_ID: 'Invalid followed user id',
  FOLLOWED: 'Followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOW_SUCCESS: 'Unfollow success',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  IMAGE_UPLOADED_SUCCESSFULLY: 'Image uploaded successfully',
  VIDEO_UPLOADED_SUCCESSFULLY: 'Video uploaded successfully',
  IMAGE_NOT_FOUND: 'Image not found',
  VIDEO_NOT_FOUND: 'Video not found',
  GET_STATUS_VIDEO_SUCCESSFULLY: 'Get status video successfully'
} as const

export const TWEET_MESSAGES = {
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  CREATE_TWEET_SUCCESSFULLY: 'Create tweet successfully'
} as const

export const BOOKMARK_MESSAGES = {
  BOOKMARK_ALREADY_EXISTS: 'Bookmark already exists',
  BOOKMARK_NOT_FOUND: 'Bookmark not found',
  BOOKMARK_SUCCESSFULLY: 'Bookmark successfully',
  DELETE_BOOKMARK_SUCCESSFULLY: 'Delete bookmark successfully'
} as const

export const LIKE_MESSAGES = {
  LIKE_ALREADY_EXISTS: 'Like already exists',
  LIKE_NOT_FOUND: 'Like not found',
  LIKE_SUCCESSFULLY: 'Like successfully',
  DELETE_LIKE_SUCCESSFULLY: 'Delete like successfully'
} as const

export default MESSAGES_ERROR
