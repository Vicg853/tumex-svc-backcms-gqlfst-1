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

      if(data?.relatedProjectsUpdate?.pushRelatedProjects?.includes(id)
      || data?.relateeToProjectsUpdate?.pushAsRelateeTo?.includes(id))
         throw new ApolloError('You can relate a project to itself!', '406')

      //TODO fix issue where a project can become a relatee to a already realtedProject
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
                  deleteMany: data!.relatedProjectsUpdate!.omitRelatedProjects!.map(relatedId => ({
                     relatedId
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
      }).then(res => ({
         data: res,
         message: null,
         err: null,
      })).catch(err => ({
         data: null,
         message: err.meta.target ?? 'Project update failed with unknown error!',
         err: err.code ?? 'INTERNAL_SERVER_ERROR',
      }))

      if(prisma.err) 
         throw new ApolloError(prisma.message, prisma.err)

      return prisma.data
   }

}