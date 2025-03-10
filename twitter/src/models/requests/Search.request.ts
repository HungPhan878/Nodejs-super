import { MediaQueryType, PeopleFollowedType } from '~/constants/enums'
import { Pagination } from './Tweet.request'
import { Query } from 'express-serve-static-core'

export interface SearchQuery extends Pagination, Query {
  content: string
  media_type: MediaQueryType
  people_followed: PeopleFollowedType
}
