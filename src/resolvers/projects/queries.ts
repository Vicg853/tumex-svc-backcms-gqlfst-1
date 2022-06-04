import type { ApolloContext } from '~/index'

import Fields from 'graphql-fields'
import { Info, Resolver, Query, Ctx, Args } from 'type-graphql'

import { ProjectResultAndRels } from './classes/queryFields'
import { ProjectQueryArgs } from './classes/queryArgs'
import { ProjGlobalFilterArgsType } from './classes/filterArgs'
import { checkOpacityCondition } from './utils'

@Resolver()
export class ProjectsQueriesResolver {
   @Query(_type => [ProjectResultAndRels], {
      nullable: true,
      description: 'Get all projects'
   })
   async getManyProjects(
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

      //const noRelsDefined = !showRelatedProjs && !showRelatedTo && !showTechStack

      //TODO Needs prisma fix for this to work properly
      const relatedProjectsFilter = filters?.relationsFilter?.related
      const relatedOpacityFilter = filters?.relationsFilter?.relatedOpacity
      const relateeToProjectsFilter = filters?.relationsFilter?.relateeTo
      const relateeToOpacityFilter = filters?.relationsFilter?.relateeToOpacity
      const techStackFilter = filters?.relationsFilter?.techStack
      //const relationAdvancedFilters = {
      //   ...(relatedProjectsFilter && { relatedProjects: { 
      //      ...(relatedProjectsFilter.some && {some: { relatedId: { in: relatedProjectsFilter.some } }}),
      //      ...(relatedProjectsFilter.every && {every: { relatedId: { in: relatedProjectsFilter.every } }}),
      //      ...(relatedProjectsFilter.none && {none: { relatedId: { in: relatedProjectsFilter.none } }}),
      //   }}),

      //   ...(relateeToProjectsFilter && { relatedTo: { 
      //      ...(relateeToProjectsFilter.some && {some: { projectId: { in: relateeToProjectsFilter.some } }}),
      //      ...(relateeToProjectsFilter.every && {every: { projectId: { in: relateeToProjectsFilter.every } }}),
      //      ...(relateeToProjectsFilter.none && {none: { projectId: { in: relateeToProjectsFilter.none } }}),
      //   }}),
      //}

      const prismaRes = await ctx.prisma.project.findMany({
         where: {
            archived: filters?.onlyArchived || (filters?.includeArchived ? undefined : false),
            hidden: filters?.onlyHidden || (filters?.includeHidden ? undefined : false),
            ...filters?.advanced,
            //...relationAdvancedFilters,
         },
         //! Temporary fix for prisma bug: we sadly need to query all field to be able to filter by them. 
         //! Performance is already not the best, but we need to do it
         include: {
            relatedProjects: { select: { id: false, relatedTo: true, relatedId: false, project: false, projectId: false } },
            relatedTo: { select: { id: false, project: true, projectId: false, relatedTo: false, relatedId: false } },
            techStack: { select: { id: false, tech: true, techId: false, project: false, projectId: false } }
         },
         //...(!noRelsDefined && {include: {
         //   ...showRelatedProjs as unknown as { relatedProjects: { select: { relatedTo: true } } },
         //   ...showRelatedTo as unknown as { relatedTo: { select: { project: true } } },
         //   ...showTechStack as unknown as { techStack: { select: { tech: true } }},
         //}})
      })

      const res: (ProjectResultAndRels | undefined)[] = prismaRes.map(project => {
         //! Temporary fix for prisma bug:
         //* For each relation (for all three possible realtions: techstack, related projects and relatee to project) 
         //* we are checking if:
         //* - the current project has at least one relation with the requested ID(s) -> some 
         //* - the current project has all the every requested ID(s) -> every
         //* - the current project has none of the none requested ID(s) -> none
         //* I didn't create a proper function for the three of the relation checks, because:
         //* 1. This is a temporary fix for the prisma bug
         //* 2. And there are many field variations, so it demands a lot of typescript and condition
         //*   checking to be done, which is not worth for temporary fix.
         //* (Deeper explanation at the first relation check)

         //* First we just ignore checks no filters for this relation are defined
         //* or there are no relations for this project
         if(relatedProjectsFilter) {
            //* Then we:
            //* 1. check if there is a some filter defined and it ins't empty -> (!some || some.length === 0) 
            //* -> true = no some filter
            //* 2. We iterate over using Javascript's Array.prototype.some method through the project's
            //* relations. We then iterate over the some filter using the same method and check if the
            //* filtered id === relation id
            //* If any of them are true, the inner some breaks with true and by consequence the outer one too
            //* If none of them are true, both inner and outer some break with false resulting in match var to be false
            const matchSomeFilter = (!relatedProjectsFilter.some || relatedProjectsFilter.some.length === 0) ||
            project.relatedProjects.some(projRel => 
               relatedProjectsFilter.some!.some(id => projRel.relatedTo.id === id))
               
            if(!matchSomeFilter) return undefined
            //* If previous is true, we then: 
            //* 1. Check if there is an every filter and it isn't empty similarly to the some filter
            //* 2. We now check if the relations length is inferior to the every filter length
            //* as in this case we know there will be ids with no match
            //* 3. Then we iterate over the filter ID(s) instead, using the every method.
            //* Inside it, we then iterate over the relations with the some method
            //* and check if the filtered id === relation id.
            //* In case there some returns no match (false), every will break with false as not every as it
            //* means that the project hasn't got at least one of the required filtered id. 
            //* Otherwise we return true, as this project has relations with every filtered id
            //* If there are more relations than filtered ids, we still return true,
            //* we are checking if the current project has at least all the filtered relations, 
            //* but not limited to them
            const matchEveryFilter = (!relatedProjectsFilter.every || relatedProjectsFilter.every.length === 0) ||
               (project.relatedProjects.length >= relatedProjectsFilter.every.length &&
                relatedProjectsFilter.every!.every(id => 
                   project.relatedProjects.some(projRel => projRel.relatedTo.id === id)))

            if(!matchEveryFilter) return undefined
            //* As both previous cases we first check if there is a none filter and it isn't empty, then:
            //* 1. We go back to to iterating over relations, now using the every method.
            //* 2. Inside it we iterate over the none filter, using the some method
            //* if any of the IDs matches, as said: some breaks with true. The trick here
            //* is that we use ! to invert the result. So if some returns a match, we get false.
            //* With that every will break with false, meaning that a relation matches the excluded ids
            //* from the none filter. Otherwise, some will always return false, making every return true,
            //* thus the project has none of the excluded ids
            const matchNoneFilter = (!relatedProjectsFilter.none || relatedProjectsFilter.none.length === 0) ||
               (project.relatedProjects.length === 0 ||
                project.relatedProjects.every(({relatedTo}) => 
                !relatedProjectsFilter.none!.some(id => relatedTo.id === id)))
            
            //* In every case, in case the match is false we directly break/return undefined
            //* as there is no need to do further processing for this project
            //* By that we avoid wasting time and resources 
            if(!matchNoneFilter) return undefined
         }
         if(relateeToProjectsFilter) {
            const matchSomeFilter = (!relateeToProjectsFilter.some || relateeToProjectsFilter.some.length === 0) ||
               project.relatedTo.some(({project}) =>
                  relateeToProjectsFilter.some!.some(id => project.id === id))

            if(!matchSomeFilter) return undefined

            const matchEveryFilter = (!relateeToProjectsFilter.every || relateeToProjectsFilter.every.length === 0) ||
               (project.relatedTo.length >= relateeToProjectsFilter.every.length &&
                relateeToProjectsFilter.every!.every(id =>
                  project.relatedTo.some(({project}) => project.id === id)))
                     

            if(!matchEveryFilter) return undefined

            const matchNoneFilter = (!relateeToProjectsFilter.none || relateeToProjectsFilter.none.length === 0) ||
               (project.relatedTo.length === 0 || 
                project.relatedTo.some(({project}) =>
                !relateeToProjectsFilter.none!.some(id => project.id === id)))
                  
            if(!matchNoneFilter) return undefined
         }

         if(techStackFilter) {
            const matchSomeFilter = (!techStackFilter.some || techStackFilter.some.length === 0) ||
               project.techStack.some(({tech}) => techStackFilter.some!.some(id => tech.id === id))

            if(!matchSomeFilter) return undefined

            const matchEveryFilter = (!techStackFilter.every || techStackFilter.every.length === 0) ||
               (project.techStack.length >= techStackFilter.every.length &&
                techStackFilter.every!.every(id =>
                   project.techStack.some(({tech}) => tech.id === id)))

            if(!matchEveryFilter) return undefined

            const matchNoneFilter = (!techStackFilter.none || techStackFilter.none.length === 0) ||
               project.techStack.some(({tech}) =>
                  !techStackFilter.none!.some(id => tech.id === id))

            if(!matchNoneFilter) return undefined
         }

         

         return {
            ...project,
            relatedProject: showRelatedProjs ? //@ts-ignore
               project.relatedProjects.map(childProj => ({ ...childProj['relatedTo'] }))
               .filter(proj => checkOpacityCondition(
                  relatedOpacityFilter,
                  proj.archived,
                  proj.hidden
               )) : undefined,
            techStack: showTechStack ? //@ts-ignore
               project.techStack.map(tech => ({ ...tech['tech'] })) : undefined,
            relatedTo: showRelatedTo ? //@ts-ignore
               project.relatedTo.map(childProj => ({ ...childProj['project'] }))
               .filter(proj => checkOpacityCondition(
                  relateeToOpacityFilter,
                  proj.archived,
                  proj.hidden
               )) : undefined,
         }
      }).filter((proj) => !!proj)

      //@ts-ignore: Error thrown as ts doesn't recognizes the above undefined filter
      //Still filter is done correctly and type check is being done at `res` def
      return res 
   }

   @Query(_type => ProjectResultAndRels, {
      nullable: true,
      description: 'Get a project by id'
   })
   async getProject(
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
