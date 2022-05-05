import type { ApolloContext } from '~/index'
import type { Prisma } from '@prisma/client'

import {
   Resolver,
   Query,
   Ctx,
   ObjectType,
   Mutation,
   Args,
   Field,
   ArgsType,
   InputType,
   Arg
} from 'type-graphql'

import { 
   Objectives,
   CreateObjectivesArgs,
   ObjectiveProgress,
   UpdateObjectivesArgs as PrismaUpdateObjectivesArgs
} from '@prisma-gen/type-graphql'
import { JSONResolver } from 'graphql-scalars'

@InputType("UpdateObjectivesArgsData", {
   isAbstract: true
})
class UpdateObjectivesArgsData {
   @Field(_type => ObjectiveProgress, {
      nullable: true 
   })
   objectiveProgress?: ObjectiveProgress | undefined;
  
   @Field(_type => String, { 
      nullable: true 
   })
   objectiveSource?: string | undefined;
  
   @Field(_type => JSONResolver, { 
      nullable: true 
   })
   objectiveName?: Prisma.InputJsonValue | undefined;
  
   @Field(_type => JSONResolver, { 
      nullable: true 
   })
   objectiveDescription?: Prisma.InputJsonValue | undefined;
}
@ArgsType()
class UpdateObjectivesArgs {
   @Field(_type => String, {
      nullable: false
   })
   id!: string

   @Field(_type => UpdateObjectivesArgsData, { 
      nullable: false 
   })
   data!: UpdateObjectivesArgsData
}

@ObjectType({ simpleResolvers: true })
@Resolver(_of => Objectives)
export class ObjectivesResolver {
   @Query(_returns => [Objectives], { nullable: true })
   async getAllObjectives(@Ctx() { prisma }: ApolloContext): Promise<Objectives[] | null> {
      return await prisma.objectives.findMany()
   }

   @Mutation(_returns => Objectives, { nullable: false }) 
   async createObjective(
      @Ctx() { prisma }: ApolloContext,
      @Args() { data }: CreateObjectivesArgs): Promise<Objectives> {
      return await prisma.objectives.create({ 
         data: {
            ...data,
            id: undefined,
            createdAt: undefined,
         }   
      })
   }

   @Mutation(_returns => Objectives, { nullable: true }) 
   async modifyObjective(
      @Ctx() { prisma }: ApolloContext,
      @Args() { data, id }: UpdateObjectivesArgs): Promise<Objectives> {
      //* To make things easier the query does not use [key]: { set: value } format
      //* so we need to process this data ourselves into prisma format

      //* rawData removes undefined values from the data objects and maps it to the prisma format
      const rawData = Object.entries(data).filter(([key, value]) => value !== undefined)
         .map(([key, value]) => ({ [key]: { set: value } }))

      //* uploadData transforms the above rawData array intro an object that prisma can use
      const uploadData: PrismaUpdateObjectivesArgs['data'] = 
         Object.assign({}, ...rawData)
      
      return await prisma.objectives.update({
         where: { id },
         data: uploadData
      })
   }

   @Mutation(_returns => Objectives, { nullable: true }) 
   async deleteObjective(
      @Ctx() { prisma }: ApolloContext,
      @Arg("id", _type => String, { 
         nullable: false
      }) id: string): Promise<Objectives> {
      return await prisma.objectives.delete({
         where: { id }
      })
   }
}