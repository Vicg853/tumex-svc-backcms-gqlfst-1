import { 
   ArgsType,
   Authorized,
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
export class ManyObjectivesQueryArgs {
   @Field(_type => ObjectivesGlobalFilter, {
      nullable: true,
      description: 'Applied filters'
   })
   filters?: ObjectivesGlobalFilter

   @Field(_type => [ObjectivesGroupByFieldEnum], {
      nullable: true,
      description: 'Grouping by rule'
   })
   group?: ObjectivesGroupByFieldEnum[]
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