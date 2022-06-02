import { 
   ArgsType,
   Authorized,
   Field, 
   InputType
} from 'type-graphql'

import {
   ObjectiveMainType
} from '../types'

import {
   ObjectiveProgress
} from '@prisma-gen/type-graphql'

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
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Filter by only hidden objectives'
   })
   onlyHidden?: boolean

   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include hidden objectives'
   })
   includeHidden?: boolean
}