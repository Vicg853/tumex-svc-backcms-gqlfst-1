import { ArgsType, Authorized, Field, InputType } from 'type-graphql'

import {
   ProjectScopes,
   EnumProjectScopesFilter,
   Project
} from '@prisma-gen/type-graphql'

@InputType()
export class ProjAdvancedFilterConditions {
   @Field(_type => [ProjAdvancedFilterArgs], {
      nullable: true,
   })
   AND?: ProjAdvancedFilterArgs[]

   @Field(_type => [ProjAdvancedFilterArgs], {
      nullable: true,
   })
   OR?: ProjAdvancedFilterArgs[]

   @Field(_type => [ProjAdvancedFilterArgs], {
      nullable: true,
   })
   NOT?: ProjAdvancedFilterArgs[]
}


@InputType()
export class TopicAdvancedFilter {
   @Field(_type => [String], {
      nullable: true,
      description: 'Topic field is equal to',
   })
   equals?: string[]

   @Field(_type => [String], {
      nullable: true,
      description: 'Topic field has every of the following values',
   })
   hasEvery?: string[]

   @Field(_type => [String], {
      nullable: true,
      description: 'Topic field has some of the following values',
   })
   hasSome?: string[]

   @Field(_type => [String], {
      nullable: true,
      description: 'Topic field is empty',
   })
   isEmpty?: boolean
}

@InputType()
export class ProjAdvancedFilterArgs extends ProjAdvancedFilterConditions {
   @Field(_type => Date, {
      nullable: true,
      description: 'Filter by start date'
   })
   startDate?: Date

   @Field(_type => Date, {
      nullable: true,
      description: 'Filter by end date'
   })
   endDate?: Date

   @Field(_type => ProjectScopes, {
      nullable: true,
      description: 'Filter by scopes'
   })
   scopes?: ProjectScopes

   @Field(_type => TopicAdvancedFilter, {
      nullable: true,
      description: 'Filter by topics'
   })
   topics?: TopicAdvancedFilter
}

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

   @Field(_type => ProjAdvancedFilterArgs, {
      nullable: true,
      description: 'Advanced filter conditions'
   })
   advanced?: ProjAdvancedFilterArgs
}

@ArgsType()
export class ProjGlobalFilterArgsType {
   @Field(_type => ProjGlobalFilterArgsInputT, {
      nullable: true,
      description: "Optional query filters"
   })
   filters?: ProjGlobalFilterArgsInputT
}