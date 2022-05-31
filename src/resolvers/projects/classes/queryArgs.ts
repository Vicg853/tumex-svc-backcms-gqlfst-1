import { Authorized, ArgsType, Field } from 'type-graphql'
import {
   ProjGlobalFilterArgs   
} from './filterArgs'

@ArgsType()
export class ProjectQueryArgs extends ProjGlobalFilterArgs {
   @Field(_type => String, {
      nullable: false,
      description: "The project's id"
   })
   id!: string
}