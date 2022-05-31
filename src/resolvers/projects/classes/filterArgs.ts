import { ArgsType, Authorized, Field, InputType } from 'type-graphql'
import {
   ProjectResult
} from './queryFields'

@InputType('ProjectGlobalFilters', {
   isAbstract: true
})
export class ProjGlobalFilterArgsInputT {
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns archived and non-archived projects."
   })
   includeArchived?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns only archived projects. Overrides \"includeArchived\"."
   })
   onlyArchived?: boolean

   //TODO Revise auth scopes
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns only hidden projects. Overrides \"includeHidden\". Requires special permissions."
   })
   onlyHidden?: boolean

   //TODO Revise auth scopes
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns archived and non-archived projects. Requires special permissions."
   })
   includeHidden?: boolean
}

@ArgsType()
export class ProjGlobalFilterArgsType extends ProjGlobalFilterArgsInputT {}