import { 
   ArgsType, 
   Field, 
   InputType
} from 'type-graphql'
import {
   ProjectScopes
} from '@prisma-gen/type-graphql'

import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

@InputType('AmountFilter', { 
   isAbstract: true 
})
export class AmountFilters {
   @Field(_type => [String], {
      nullable: true
   })
   every?: string[] 

   @Field(_type => [String], {
      nullable: true
   })
   some?: string[]
   @Field(_type => [String], {
      nullable: true
   })
   none?: string[]
}

@InputType()
export class ProjectOpacityRelatedFilters {
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

   @AuthMiddle({
      scopes: [Scopes.projectsHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns only hidden projects. Overrides \"includeHidden\". Requires special permissions."
   })
   onlyHidden?: boolean
   
   
   @AuthMiddle({
      scopes: [Scopes.projectsHiddenRead]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: "If true, returns archived and non-archived projects. Requires special permissions."
   })
   includeHidden?: boolean
}

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

@InputType() 
export class ProjRelationFilterArgs {
   @Field(_type => AmountFilters, {
      nullable: true,
      description: 'Projects\'s related condition'
   })
   related?: AmountFilters

   @Field(_type => ProjectOpacityRelatedFilters, {
      nullable: true,
      description: 'Projects\'s related opacity conditions'
   })
   relatedOpacity?: ProjectOpacityRelatedFilters

   @Field(_type => AmountFilters, {
      nullable: true,
      description: 'Project as relatee conditions'
   })
   relateeTo?: AmountFilters

   @Field(_type => ProjectOpacityRelatedFilters, {
      nullable: true,
      description: 'Projects\' the current is relatee of, opacity conditions'
   })
   relateeToOpacity?: ProjectOpacityRelatedFilters

   @Field(_type => AmountFilters, {
      nullable: true,
      description: 'Filter by tech stack'
   })
   techStack?: AmountFilters
}


@InputType('ProjectGlobalFilters', {
   isAbstract: true
})
export class ProjGlobalFilterArgsInputT extends ProjectOpacityRelatedFilters {
   @Field(_type => ProjAdvancedFilterArgs, {
      nullable: true,
      description: 'Advanced filter conditions'
   })
   advanced?: ProjAdvancedFilterArgs

   @Field(_type => ProjRelationFilterArgs, {
      nullable: true,
      description: 'Filter by project relations'
   })
   relationsFilter?: ProjRelationFilterArgs
}

@ArgsType()
export class ProjGlobalFilterArgsType {
   @Field(_type => ProjGlobalFilterArgsInputT, {
      nullable: true,
      description: "Optional query filters"
   })
   filters?: ProjGlobalFilterArgsInputT
}