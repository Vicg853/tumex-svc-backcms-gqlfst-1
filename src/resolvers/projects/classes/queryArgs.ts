import { Authorized, ArgsType, Field } from 'type-graphql'

@ArgsType()
export class OpacityRelatedProjectArgs {
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
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns only hidden projects. Overrides \"includeHidden\". Requires special permissions."
   })
   onlyHidden?: boolean
   
   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns archived and non-archived projects. Requires special permissions."
   })
   includeHidden?: boolean
}

@ArgsType()
export class ProjectQueryArgs {
   @Field(_type => String, {
      nullable: false,
      description: "The project's id"
   })
   id!: string

   //TODO Revise auth scopes
   @Authorized("SUDO")
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true ignores 'hidden' state. Requires special permissions.",
   })
   includeHidden?: boolean
}