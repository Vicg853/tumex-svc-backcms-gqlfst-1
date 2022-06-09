import {
   ArgsType, Field
} from 'type-graphql'

import {
   TechBasicSharedFilters,
   TechsAdvancedSharedFilters
} from './filterArgs'

@ArgsType()
export class QueryArgs extends TechBasicSharedFilters {
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