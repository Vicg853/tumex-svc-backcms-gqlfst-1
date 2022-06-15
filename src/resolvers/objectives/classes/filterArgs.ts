import type {
   ObjectiveMainType
} from '../types'

import { 
   ArgsType,
   Field, 
   InputType
} from 'type-graphql'


import {
   ObjectiveProgress
} from '@prisma-gen/type-graphql'
import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

@InputType() 
class ManyProjectFilterConditions {
   @Field(_type => [ManyProjectFilterOptions], {
      nullable: true,
   })
   AND?: ManyProjectFilterOptions[]

   @Field(_type => [ManyProjectFilterOptions], {
      nullable: true,
   })
   OR?: ManyProjectFilterOptions[]

   @Field(_type => [ManyProjectFilterOptions], {
      nullable: true,
   })
   NOT?: ManyProjectFilterOptions[]
}

@InputType() 
class ManyProjectFilterOptions extends ManyProjectFilterConditions {
   @Field(_type => ObjectiveProgress, {
      nullable: true,
      description: 'Group by progress'
   })
   progress?: ObjectiveMainType['progress']

   @Field(_type => Number, {
      nullable: true,
      description: 'Group by year'
   })
   year?: ObjectiveMainType['year']
}

@InputType()
@ArgsType()
export class ObjectivesGlobalFilter extends ManyProjectFilterOptions {
   @AuthMiddle({
      scopes: [Scopes.objectivesHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by only hidden objectives'
   })
   onlyHidden?: boolean

   @AuthMiddle({
      scopes: [Scopes.objectivesHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include hidden objectives'
   })
   includeHidden?: boolean
}