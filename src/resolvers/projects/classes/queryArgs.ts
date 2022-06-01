import { Authorized, ArgsType, Field } from 'type-graphql'
import {
   ProjGlobalFilterArgsInputT   
} from './filterArgs'

@ArgsType()
export class ProjectQueryArgs extends ProjGlobalFilterArgsInputT {
   @Field(_type => String, {
      nullable: false,
      description: "The project's id"
   })
   id!: string
}