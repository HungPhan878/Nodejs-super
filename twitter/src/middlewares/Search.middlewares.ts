import { checkSchema } from 'express-validator'
import { MediaQueryType, PeopleFollowedType } from '~/constants/enums'
import MESSAGES_ERROR from '~/constants/messages'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: MESSAGES_ERROR.CONTENT_MUST_BE_A_STRING
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaQueryType)],
          errorMessage: MESSAGES_ERROR.MEDIA_TYPE_IS_INVALID
        }
      },
      people_followed: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollowedType)],
          errorMessage: MESSAGES_ERROR.PEOPLE_FOLLOWED_IS_INVALID
        }
      }
    },
    ['query']
  )
)
