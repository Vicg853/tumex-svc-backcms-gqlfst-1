import {
   Field,
   ArgsType,
   InputType
} from 'type-graphql'
import { ObjectiveProgress } from '@prisma-gen/type-graphql'

import { 
   ObjectiveMainType, 
   ObjectiveProgress as ObjectiveProgressType, 
} from '../types'
import { Scopes } from '@config/jwt-tkn'
import { AuthMiddle } from '@middlewares/auth'


//*--------------------------------------------------------------------------
//*-- Bulk modification args

@InputType({
   description: 'Update objective filter conditions.',
})
export class ObjectiveModFilterCondInput {
   @Field(() => [ObjectiveModFilterInput], {
      description: 'AND condition.',
      nullable: true,
   })
   AND?: ObjectiveModFilterInput[]
   
   @Field(() => [ObjectiveModFilterInput], {
      description: 'OR condition.',
      nullable: true,
   })
   OR?: ObjectiveModFilterInput[]
   
   @Field(() => [ObjectiveModFilterInput], {
      description: 'NOT condition.',
      nullable: true,
   })
   NOT?: ObjectiveModFilterInput[]
}

@InputType({
   description: 'Filter objectives that should be modified. e.g.: \'{ year: 2022 }\' as filter will update all objectives with 2022 year value.'
})
export class ObjectiveModFilterInput extends ObjectiveModFilterCondInput {
   @Field(() => Number, {
      description: 'Filter by year',
      nullable: true
   })
   year?: number

   @Field(() => ObjectiveProgress, {
      description: 'Filter by progress',
      nullable: true
   })
   progress?: ObjectiveProgressType

   @Field(() => String, {
      description: 'Filter by name',
      nullable: true
   })
   name?: string

   @Field(() => String, {
      description: 'Filter by source',
      nullable: true
   })
   source?: string
}

@ArgsType()
export class ObjectiveBulkModArgs {
   @Field(() => [String], {
      description: 'Objectives\' IDs to modify. Can be only. If neither it or a filter are specified, all objectives will be modified.',
      nullable: true,
   })
   ids?: ObjectiveMainType['id'][]
   
   @Field(() => ObjectiveModFilterInput, {
      description: 'Filter objectives that should be modified. e.g.: \'{ year: 2022 }\' as filter will update all objectives with 2022 year value.',
      nullable: true,
   })
   filter?: ObjectiveModFilterInput

   @AuthMiddle({
      scopes: [Scopes.objectivesHiddenEdit]
   })
   @Field(() => Boolean, {
      description: 'Opacity value to set.',
      nullable: true,
   })
   hidden?: ObjectiveMainType['hidden']

   @Field(() => ObjectiveProgress, {
      description: 'Progress value to set.',
      nullable: true,
   })
   progress?: ObjectiveMainType['progress']

   @Field(() => String, {
      description: 'Source value to set.',
      nullable: true,
   })
   source?: ObjectiveMainType['source']

   @Field(() => Number, {
      description: 'Year value to set.',
      nullable: true,
   })
   year?: ObjectiveMainType['year']
}

//*--------------------------------------------------------------------------
//*-- Individual objective mod args base class

@InputType()
class LocaleUpdateFields {
   @Field(() => String, {
      description: 'English locale value to set.',
      nullable: true,
   })
   en?: string

   @Field(() => String, {
      description: 'French locale value to set.',
      nullable: true,
   })
   fr?: string | null

   @Field(() => String, {
      description: 'Brazilian portuguese locale value to set.',
      nullable: true,
   })
   pt?: string | null
}

@ArgsType()
@InputType({
   description: 'Objective modification input type.'
})
export class ObjectiveModInput {
   @Field(() => String, {
      description: 'Objective\'s ID to be updated.',
      nullable: false,
   })
   id!: ObjectiveMainType['id']

   @Field(() => LocaleUpdateFields, {
      description: 'Objective\'s title to modify.',
      nullable: true,
   })
   title?: ObjectiveMainType['title']

   @Field(() => LocaleUpdateFields, {
      description: 'Objective\'s description to modify.',
      nullable: true,
   })
   description?: ObjectiveMainType['description']

   @Field(() => ObjectiveProgress, {
      description: 'Objective\'s progress to modify.',
      nullable: true,
   })
   progress?: ObjectiveProgressType

   @Field(() => String, {
      description: 'Objective\'s source to modify.',
      nullable: true,
   })
   source?: ObjectiveMainType['source']

   @Field(() => Number, {
      description: 'Objective\'s year to modify.',
      nullable: true,
   })
   year?: ObjectiveMainType['year']

   @AuthMiddle({
      scopes: [Scopes.objectivesHiddenEdit]
   })
   @Field(() => Boolean, {
      description: 'Objective\'s hidden state to modify.',
      nullable: true,
   })
   hidden?: ObjectiveMainType['hidden']
}

//*--------------------------------------------------------------------------
//*-- Many objectives mod args

@InputType({
   description: 'Objective shared modification input type. Used to mofify a same value for multiple objectives.'
})
export class ObjectiveModSharedInput {
   @Field(() => Number, {
      description: 'Year value to set.',
      nullable: true,
   })
   year?: number

   @Field(() => ObjectiveProgress, {
      description: 'Progress value to set.',
      nullable: true,
   })
   progress?: ObjectiveProgressType

   @Field(() => Boolean, {
      description: 'Hidden state to set.',
      nullable: true,
   })
   hidden?: boolean
}

@ArgsType()
export class ManyObjectivesModArgs {
   @Field(() => [ObjectiveModInput], {
      description: 'Objectives array to modify.',
      nullable: false,
   })
   data!: ObjectiveModInput[]

   @Field(() => ObjectiveModSharedInput, {
      description: 'Objectives shared modification data. Optional',
      nullable: true,
   })
   shared?: ObjectiveModSharedInput
}
