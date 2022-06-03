import { 
   ArgsType,
   Field,
   registerEnumType
} from 'type-graphql'

import { 
   ObjectivesGlobalFilter
} from './filterArgs'

export enum ObjectivesGroupByFieldEnum {
   progress = "progress",
   source = "source",
   year = "year"
 }
 registerEnumType(ObjectivesGroupByFieldEnum, {
   name: "ObjectivesGroupByFieldEnum",
   description: undefined,
 });

@ArgsType()
export class ManyObjectivesGroupQueryArgs {
   @Field(_type => [ObjectivesGroupByFieldEnum], {
      nullable: false,
      description: 'Grouping pattern'
   })
   group!: ObjectivesGroupByFieldEnum[]

   @Field(_type => ObjectivesGlobalFilter, {
      nullable: true,
      description: 'Filters'
   })
   filters?: ObjectivesGlobalFilter
}