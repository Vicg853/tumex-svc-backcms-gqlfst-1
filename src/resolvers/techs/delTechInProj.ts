import type { ApolloContext } from '~/index'

import {
  Ctx,
  Args,
  Resolver,
  Mutation
} from 'type-graphql'
import { ApolloError } from 'apollo-server-core'

import {
   DeleteTechsInProjArgs,
   DeleteProjsTechsArgs,
} from './classes/relDelArgs'
import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'


@Resolver()
export class DeleteTechsInProjResolver {
  @AuthMiddle({
    scopes: [Scopes.techEdit]
  })
  @Mutation(() => String, {
    nullable: true,
    description: 'Delete a tech(s) from project(s) realtion (remove tech(s) from project(s).'
  })
  async removeProjsFromTech(
    @Ctx() ctx: ApolloContext,
    @Args() { techId, projectIds }: DeleteTechsInProjArgs,
  ): Promise<string | null> {
    const prismaRes = await ctx.prisma.techsInProjects.deleteMany({
      where: { techId, projectId: { in: projectIds } },
    }).then(res => ({
      count: res.count,
      message: null,
      err: null,
    })).catch(err => ({
      count: 0,
      message: err.message ?? 'Error unlinking this tech from project(s).',
      err: err.code,
    }))

    if(prismaRes.err)
      throw new ApolloError(prismaRes.message, prismaRes.err)
    
     return `${prismaRes.count} projects unlinked from tech.`
  }

  @AuthMiddle({
    scopes: [Scopes.projectsEdit]
  })
  @Mutation(() => String, {
    nullable: true,
    description: 'Remove tech(s) link(s) from a project.'
  })
  async removTechsFromProjs(
    @Ctx() ctx: ApolloContext,
    @Args() { techIds, projectId }: DeleteProjsTechsArgs,
  ): Promise<string | null> {
    const prismaRes = await ctx.prisma.techsInProjects.deleteMany({
      where: { techId: { in: techIds }, projectId },
    }).then(res => ({
      count: res.count,
      message: null,
      err: null,
    })).catch(err => ({
      count: 0,
      message: err.message ?? 'Error unlinking this tech from project(s).',
      err: err.code,
    }))

    if(prismaRes.err)
      throw new ApolloError(prismaRes.message, prismaRes.err)
    
    return `${prismaRes.count} tech(s) unlinked from project.`
  }
}
