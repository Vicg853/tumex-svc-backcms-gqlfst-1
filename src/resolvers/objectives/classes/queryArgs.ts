import { 
   ArgsType,
   Authorized,
   Field
} from 'type-graphql'

import {
   ObjectivesGlobalFilter
} from './filterArgs'
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

   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Get if objectives\'s hidden'
   })
   includeHidden?: boolean
}