import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
  Resolver,
  Ctx,
  Mutation,
  Args,
} from 'type-graphql'

import { CreateTechInProjArgs } from './classes/relCreateArgs'

@Resolver()
export class CreateTechInProjResolver {
  @Mutation(() => [String], {
    nullable: true,
    description: 'Create a new tech(s) in project(s) realtion (append tech(s) to project(s).'
  })
  async addTechToProj(
    @Ctx() ctx: ApolloContext,
    @Args() { projectId, techId }: CreateTechInProjArgs,
  ): Promise<string[] | null> {

     if(projectId.length === 0 || techId.length === 0) 
       throw new ApolloError('You must pass at least one value to both project(s) and tech(s) ', '406')
    //TODO Imrpove overall performance
    
    //* Although performance isn't the best here,
    //* the following code (I'm only considering the first
    //* function, down here) acctually can help improve
    //* performance in some cases: 
    //* In a case where some of the tech ids does not exist
    //* it will throw an error, by consequence, the transaction
    //* query will not be executed.
    //* If we weren't checking this, in case like this one,
    //* prisma would error with each ran operation, which could lead
    //* to an enourmous and expensive waste of time and resources.

    const techCheckRes = await ctx.prisma.techs.count({ 
      where: { id: {in: techId }}
    }).then(res => ({
      count: res,
      message: null,
      err: null,
      unexpected: null,
    })).catch(err => ({ 
      count: 0,
      message: err.message,
      err: err.code,
      unexpected: true,
    }))

    if(techCheckRes.err)
      throw new ApolloError(techCheckRes.message)
	
    if(techCheckRes.count < techId.length)
      throw new ApolloError('Tech(s) with this(these) ID(s) not found.', '404')
    
     
    const prismaRes = await ctx.prisma.$transaction( 
      projectId.map(id => ctx.prisma.project.update({
        where: { id },
	data: {
	  techStack: {
	    create: techId.map(id => ({ tech: { connect: { id } }})),
	  },
	},
        select: { id: true, techStack: { where: { id: { in: techId } } } }
      }))
    ).then(res => ({
      data: res,
      message: null,
      err: null,
    })).catch(err => ({
      data: null,
      message: err.message ?? 'Uknwon error trying to add tech(s) to project(s).',
      err: err.code ?? 'INTERNAL_SERVER_ERROR',
    }))
    
    if(prismaRes.err === 'P2002')
      throw new ApolloError('One or more of the project -> tech relations already exists.', 'P2002')
    if(prismaRes.err)
      throw new ApolloError(prismaRes.message, prismaRes.err)

    if(!prismaRes.data)
      throw new ApolloError('Uknwon error trying to add tech(s) to project(s).', 'INTERNAL_SERVER_ERROR')
 
    return prismaRes.data.map(res => `Upserted ${techId.length} tech${res.techStack.length > 1 ? 's' : ''} relation(s) to project ${res.id}`)
  }
}
