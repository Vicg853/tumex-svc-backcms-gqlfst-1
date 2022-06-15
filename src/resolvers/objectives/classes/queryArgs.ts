import { 
   ArgsType,
   Field
} from 'type-graphql'

import {
   ObjectivesGlobalFilter
} from './filterArgs'
import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'
@ArgsType()
export class ManyObjectivesQueryArgs {
   @Field(_type => ObjectivesGlobalFilter, {
      nullable: true,
      description: 'Applied filters'
   })
   filters?: ObjectivesGlobalFilter
}

@ArgsType()
export class QueryOneObjectiveArgs {
   @Field(_type => String, {
      nullable: false,
      description: 'Get a objective\'s id'
   })
   id?: string

   @AuthMiddle({
      scopes: [Scopes.objectivesHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Get if objectives\'s hidden'
   })
   includeHidden?: boolean
}