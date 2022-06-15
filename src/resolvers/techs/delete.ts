import type { ApolloContext } from '~/index'

import { ApolloError } from 'apollo-server-core'
import {
  Ctx, 
  Mutation,
  Arg,
  Resolver
} from 'type-graphql'

import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

@Resolver()
export class TechDeleteResolver {
  @AuthMiddle({
    scopes: [Scopes.techDelete]
  })
  @Mutation(() => String)
  async deleteTech(
    @Ctx() ctx: ApolloContext,
    @Arg('ids', _type => [String], {
      nullable: false,
      description: 'Tech\'s ids to be deleted'
    }) ids: string[]
  ): Promise<string> {
    const prismaRes = await ctx.prisma.techs.deleteMany({
      where: { id: { in: ids } }
    }).then(res => ({
      count: res.count,
      message: null,
      err: null
    })).catch(err => ({
      count: 0,
      message: err.message ?? 'An unknown error occurred while deleting techs',
      err: err.code ?? 'INTERNAL_SERVER_ERROR'
    }))

    if(prismaRes.err)
	throw new ApolloError(prismaRes.message, prismaRes.err)

    return `${prismaRes.count} techs deleted`
  }
}
