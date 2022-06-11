import {
   ArgsType, Field
} from 'type-graphql'

import {
   TechBasicSharedFilters,
   TechsAdvancedSharedFilters
} from './filterArgs'
import {
  GroupsTechsFieldsEnum
} from './groupingArgs'

@ArgsType()
export class QueryManyArgs extends TechBasicSharedFilters {
   @Field(_type => TechsAdvancedSharedFilters, {
      nullable: true,
      description: 'Filter technologies by specific field(s) and condition(s)'
   })
   filter?: TechsAdvancedSharedFilters
}

@ArgsType()
export class QueryManyGroupedArgs extends QueryManyArgs {
   @Field(_type => [GroupsTechsFieldsEnum], {
      nullable: false,
      description: 'Fields to group techs by'
   })
   group!: GroupsTechsFieldsEnum[]
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
