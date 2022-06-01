import { ArgsType, Authorized, Field, InputType, registerEnumType } from 'type-graphql'
import {
   ProjectResult
} from './queryFields'

import {
   ProjGlobalFilterArgsInputT
} from './filterArgs'

@InputType()
class ProjectRelateesFilterArgs extends ProjGlobalFilterArgsInputT {
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include or not archived relatees'
   })
   includeArchivedRelatees?: boolean

   //TODO Revise auth scopes
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include or not hidden relatees'
   })
   includeHiddenRelatees?: boolean
}

@ArgsType()
export class PorjectRelateeArgs {
   @Field(_type => String, {
      nullable: false,
      description: 'Queried project\'s id'
   })
   project!: string

   @Field(_type => String, {
      nullable: true,
      description: 'Project\'s relatees id to query for. All relatees are returned if not specified.'
   })
   relatees?: string[]

   @Field(_type => ProjectRelateesFilterArgs, {
      nullable: true,
      description: 'Optionla query filters'
   })
   filters?: ProjectRelateesFilterArgs
}

@InputType()
class ProjToProjRelationFilters extends ProjGlobalFilterArgsInputT {
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include or not archived related or relatee projects (based on grouping mthod)'
   })
   includeArchivedRelated?: boolean

   //TODO Revise auth scopes
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Include or not hidden related or relatee projects (based on grouping method)'
   })
   includeHiddenRelated?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Only include or not archived related or relatee projects (based on grouping method)'
   })
   onlyArchivedRelated?: boolean

   //TODO Revise auth scopes
   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Only include or not hidden related or relatee projects (based on grouping method)'
   })
   onlyHiddenRelated?: boolean
}


export enum GroupByEnum {
   PROJECT,
   PROJECTRELATEES,
   NOGROUP
}
registerEnumType(GroupByEnum, {
   name: 'ProjectRelationGroupingEnum',
   description: 'Grouping method for projects and their relatees',
})

@ArgsType()
export class ProjToProjRelationArgs {
   @Field(_type => GroupByEnum, {
      nullable: true,
      description: 'Group results',
      defaultValue: GroupByEnum.NOGROUP
   })
   group?: GroupByEnum

   @Field(_type => ProjToProjRelationFilters, {
      nullable: true,
      description: 'Optional query filters'
   })
   filters?: ProjToProjRelationFilters

}