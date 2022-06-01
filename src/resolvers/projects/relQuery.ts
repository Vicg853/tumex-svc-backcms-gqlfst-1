import type { ApolloContext } from '~/index'
import type { Prisma } from '@prisma/client'

import { Resolver, Query, Ctx, Args } from 'type-graphql'

import {
   ProjectResult,
} from './classes/queryFields'
import { 
   ProjToProjRelationArgs,
   GroupByEnum
} from './classes/relQueryArgs'

@Resolver()
export class ProjectsRelationQueryResolver {
   @Query(_type => ProjectResult, {
      nullable: true,
      description: 'Get all project relations'
   })
   async projToProjRelations(
      @Ctx() ctx: ApolloContext,
      @Args() {
         group,
         filters
      }: ProjToProjRelationArgs
   ): Promise<ProjectResult[] | null> {
      const shouldGroup = group !== GroupByEnum.NOGROUP

      const mainProjArchivedCondition = filters?.onlyArchived || (filters?.includeArchived ? undefined : false) 
      const mainProjHiddenCondition = filters?.onlyHidden || (filters?.includeHidden ? undefined : false) 

      const relatedProjArchivedCondition = filters?.onlyArchivedRelated || (filters?.includeArchivedRelated ? undefined : false)
      const relatedProjHiddenCondition = filters?.onlyHiddenRelated || (filters?.includeHiddenRelated ? undefined : false)

      const include: Prisma.ProjectRelationInclude = {
         project: true,
         relatedTo: true
      }

      const groupedQuery: Prisma.ProjectRelationGroupByArgs = {
         by: group === GroupByEnum.PROJECTRELATEES ? ['relatedId'] : ['projectId'],
         where: {
            project: {
               archived: group === GroupByEnum.PROJECT ? 
                  mainProjArchivedCondition : relatedProjArchivedCondition,
               hidden: group === GroupByEnum.PROJECT ?
                  mainProjHiddenCondition : relatedProjHiddenCondition
            },
            relatedTo: {
               archived: group === GroupByEnum.PROJECTRELATEES ?
                  mainProjArchivedCondition : relatedProjArchivedCondition,
               hidden: group === GroupByEnum.PROJECTRELATEES ?
                  mainProjHiddenCondition : relatedProjHiddenCondition
            }
         }
      }

      const notGroupedQuery: Prisma.ProjectRelationFindManyArgs = {
         where: {
            project: {
               archived: mainProjArchivedCondition,
               hidden: mainProjHiddenCondition
            },
            relatedTo: {
               archived: relatedProjArchivedCondition,
               hidden: relatedProjHiddenCondition
            }
         },
         include: include
      }

      const prismaQuery = shouldGroup ? 
         async () => await ctx.prisma.projectRelation.groupBy(groupedQuery as any) :
         async () => await ctx.prisma.projectRelation.findMany(notGroupedQuery)

      const prismaRes = await prismaQuery().then(res => ({
         data: res,
         err: null,
         message: null,
      }))
      .catch(err => ({
         data: null,
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
         message: err.meta.target ?? 'Project relations query failed with unknown error!',
      }))

      if(!!prismaRes.err) 
         throw new Error(prismaRes.message)
      
      console.log(prismaRes.data)
      return null
   }
}
