import type { ApolloContext } from '~/index'

import Fields from 'graphql-fields'
import { Info, Resolver, Query, Ctx, Args } from 'type-graphql'

import { ProjectResultAndRels } from './classes/queryFields'
import { ProjectQueryArgs } from './classes/queryArgs'
import { ProjGlobalFilterArgsType } from './classes/filterArgs'

@Resolver()
export class ProjectsQueriesResolver {
   @Query(_type => [ProjectResultAndRels], {
      nullable: true,
      description: 'Get all projects'
   })
   async projects(
      @Ctx() ctx: ApolloContext,
      @Args() { 
         filters
      }: ProjGlobalFilterArgsType,
      @Info() info: any
   ): Promise<ProjectResultAndRels[]> {
       //TODO Improve this when its inheritance resolvers is ready
      //* To prevent useless queries and data transfers from/to the database,
      //* we need to retrieve the query requested fields, map those to 
      //* the db relational include queries. 
      //* In case they are not defined we simply return undefined, this way prisma
      //* won't even bother thinking about them.
      //* Quite a janky way to do it, but it works until proper 
      //* field resolvers for these are implemented
      const fields = Fields(info)
      const showRelatedProjs = fields['relatedProject'] ? { relatedProjects:{ 
            select: { id: false, relatedTo: true, relatedId: false, project: false, projectId: false }
      } } : undefined
      const showRelatedTo = fields['relatedTo'] ? {  relatedTo: {
            select: { id: false, project: true, projectId: false, relatedTo: false, relatedId: false }
      } } : undefined
      const showTechStack = fields['techStack'] ? { techStack: { 
         select: { id: false, tech: true, techId: false, project: false, projectId: false }
      } } : undefined

      const noneDefined = !showRelatedProjs && !showRelatedTo && !showTechStack



      const prisma = await ctx.prisma.project.findMany({
         where: {
            archived: filters?.onlyArchived || (filters?.includeArchived ? undefined : false),
            hidden: filters?.onlyHidden || (filters?.includeHidden ? undefined : false),
            ...filters?.advanced
         },
         ...(!noneDefined && {include: {
            ...showRelatedProjs as unknown as { relatedProjects: { select: { relatedTo: true } } },
            ...showRelatedTo as unknown as { relatedTo: { select: { project: true } } },
            ...showTechStack as unknown as { techStack: { select: { tech: true } }},
         }})
      })


      return prisma.map(project => ({
         ...project,
         relatedProject: showRelatedProjs ? //@ts-ignore
            project.relatedProjects.map(childProj => ({ ...childProj['relatedTo'] })) : undefined,
         techStack: showTechStack ? //@ts-ignore
            project.techStack.map(tech => ({ ...tech['tech'] })) : undefined,
         relatedTo: showRelatedTo ? //@ts-ignore
            project.relatedTo.map(childProj => ({ ...childProj['project'] })) : undefined,
      }))
   }

   @Query(_type => ProjectResultAndRels, {
      nullable: true,
      description: 'Get a project by id'
   })
   async project(
      @Ctx() ctx: ApolloContext,
      @Args() {id, includeHidden}: ProjectQueryArgs,
      @Info() info: any
   ): Promise<ProjectResultAndRels | null> {
      //TODO Improve this when its inheritance resolvers is ready
      //* To prevent useless queries and data transfers from/to the database,
      //* we need to retrieve the query requested fields, map those to 
      //* the db relational include queries. 
      //* In case they are not defined we simply return undefined, this way prisma
      //* won't even bother thinking about them.
      //* Quite a janky way to do it, but it works until proper 
      //* field resolvers for these are implemented
      const fields = Fields(info)
      const showRelatedProjs = fields['relatedProject'] ? { relatedProjects:{ 
            select: { id: false, relatedTo: true, relatedId: false, project: false, projectId: false }
      } } : undefined
      const showRelatedTo = fields['relatedTo'] ? {  relatedTo: {
            select: { id: false, project: true, projectId: false, relatedTo: false, relatedId: false }
      } } : undefined
      const showTechStack = fields['techStack'] ? { techStack: { 
         select: { id: false, tech: true, techId: false, project: false, projectId: false }
      } } : undefined

      const noneDefined = !showRelatedProjs && !showRelatedTo && !showTechStack
      
      const res = await ctx.prisma.project.findUnique({
         where: {
            id, 
         },
         rejectOnNotFound: false,
         ...(!noneDefined && {include: {
            ...showRelatedProjs as unknown as { relatedProjects: { select: { relatedTo: true } } },
            ...showRelatedTo as unknown as { relatedTo: { select: { project: true } } },
            ...showTechStack as unknown as { techStack: { select: { tech: true } }},
         }})
      })

      if (!res || (res.hidden && !includeHidden)) {
         return null
      }

      return {
         ...res,
         relatedProject: showRelatedProjs ? //@ts-ignore
            res.relatedProjects.map(proj => ({ ...proj['relatedTo'] })) : undefined,
         techStack: showTechStack ? //@ts-ignore
            res.techStack.map(tech => ({ ...tech['tech'] })) : undefined,
         relatedTo: showRelatedTo ?  //@ts-ignore
            res.relatedTo.map(proj => ({ ...proj['project'] })) : undefined,
      }
   }
}
