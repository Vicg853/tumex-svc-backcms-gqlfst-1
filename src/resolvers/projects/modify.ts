import type { ApolloContext } from '~/index'
import type {
   Prisma
} from '@prisma/client'

import { ApolloError } from 'apollo-server-core'
import { Args, Authorized, Ctx, Mutation, Resolver } from 'type-graphql'

import {
   ProjectResult
} from './classes/queryFields'
import { 
   ModProjectArgs, 
   ModProjectData
} from './classes/modArgs'

@Resolver()
export class ModifyProjectsResolver {
   //TODO: Revise auth scopes
   @Authorized("SUDO")
   @Mutation(_returns => ProjectResult, {
      nullable: true,
      description: "Modify a project"
   })
   async modProject(
      @Ctx() ctx: ApolloContext,
      @Args() { id, data, opacityUpdate }: ModProjectArgs,
   ): Promise<ProjectResult | null> {
      if(!data && !opacityUpdate) 
         throw new ApolloError('No data or opacity update inputs were provided. At least one of them must be assigned.', '406')

      const dataFilter = {
         ...data,
         relatedProjectsUpdate: undefined,
         relateeToProjectsUpdate: undefined,
         projectTechStackUpdate: undefined,
      }

      const prisma = await ctx.prisma.project.update({
         where: { id },
         data: {
            ...dataFilter,
            relatedProjects: data!.relatedProjectsUpdate ? {
               ...(data!.relatedProjectsUpdate!.pushRelatedProjects && {
                  create: data!.relatedProjectsUpdate!.pushRelatedProjects!.map(id => ({
                     relatedTo: { connect: { id } }
                  })),
               }),
               ...(data!.relatedProjectsUpdate!.omitRelatedProjects && {
                  deleteMany: data!.relatedProjectsUpdate!.omitRelatedProjects!.map(id => ({
                     id
                  })),
               }),
            } : undefined,
            relatedTo: data!.relateeToProjectsUpdate ? {
               ...(data!.relateeToProjectsUpdate!.pushAsRelateeTo && {
                  create: data!.relateeToProjectsUpdate!.pushAsRelateeTo!.map(id => ({
                     project: { connect: { id } }
                  }))
               }),
               ...(data!.relateeToProjectsUpdate!.omitAsRelateeTo && {
                  deleteMany: data!.relateeToProjectsUpdate!.omitAsRelateeTo!.map(projectId => ({
                     projectId
                  }))
               })
            } : undefined,
            techStack: data!.projectTechStackUpdate ? {
               ...(data!.projectTechStackUpdate!.appendTechID && {
                  create: data!.projectTechStackUpdate!.appendTechID.map(id => ({
                     tech: { connect: { id } }
                  }))
               }),
               ...(data!.projectTechStackUpdate!.omitTechID && {
                  deleteMany: data!.projectTechStackUpdate!.omitTechID.map(techId => ({
                     techId
                  }))
               })
            } : undefined,
         }
      }).then(res => {
         return {
            data: res,
            err: null,
         }
      }).catch(err => {
         console.log(err)
         return {
            data: null,
            err: err.code ?? 'INTERNAL_SERVER_ERROR',
         }
      })

      if(prisma.err) 
         throw new ApolloError('Project update failed!', prisma.err)

      return prisma.data
   }

}