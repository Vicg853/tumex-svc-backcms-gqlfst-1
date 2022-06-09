import {
   ArgsType, Field
} from 'type-graphql'

import {
   TechBasicSharedFilters,
   TechsAdvancedSharedFilters
} from './filterArgs'

@ArgsType()
export class QueryManyArgs extends TechBasicSharedFilters {
   @Field(_type => TechsAdvancedSharedFilters, {
      nullable: true,
      description: 'Filter technologies by specific field(s) and condition(s)'
   })
   filter?: TechsAdvancedSharedFilters

   //@Field(_type => GroupByInput, {
   //   nullable: true,
   //   description: 'Group technologies by specific field(s)'
   //})
   //group?: GroupByInput
}

@ArgsType()
export class QueryOnlyArgs extends TechBasicSharedFilters {
   @Field(_type => String, {
      nullable: true,
      description: 'The ID of the tech to query'
   })
   id?: string

   @Field(_type => String, {
      nullable: true,
      description: 'The name of the tech to query'
   })
   name?: string
}