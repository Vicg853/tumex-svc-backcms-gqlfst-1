import type { ApolloContext } from '~/index'

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
   Arg,
   Authorized
} from 'type-graphql'

import { 
   Project as ProjectPrismaType,
   CreateProjectArgs,
   ProjectTextLocalesCreateInput,
   ProjectTextLocales,
   ProjectScopes,
   TechStackCreateInput,
   TechStack,
   ProjectSourceCreateInput,
   ProjectSource,
   UpdateProjectArgs as PrismaUpdateProjectArgs,
} from '@prisma-gen/type-graphql'



@ArgsType()
@InputType("MutateObjectivesArgsData", {
   isAbstract: true
})
class MutateProjectArgsData {
   @Field(_type => String, {
      nullable: true,
      description: "The project's image."
   })
   image!: string

   @Field(_type => ProjectTextLocalesCreateInput, {
      nullable: true,
      description: "Project name in three languages: English, French, and Brazilian Portuguese."
   })
   projectName!: ProjectTextLocalesCreateInput

   @Field(_type => ProjectTextLocalesCreateInput, {
      nullable: true,
      description: "Project description in three languages: English, French, and Brazilian Portuguese."
   })
   projectDescription!: ProjectTextLocalesCreateInput

   @Field(_type => ProjectScopes, {
      nullable: true,
      description: "The scopes for this project"
   })
   projectScope?: ProjectScopes

   @Field(_type => [TechStackCreateInput], {
      nullable: true,
      description: "Project's tech stack"
   })
   techStack!: TechStackCreateInput[]
   
   @Field(_type => [String], {
      nullable: true,
      description: "Project's topics"
   })
   topics!: string[]

   @Field(_type => Date, {
      nullable: true,
      description: "Project's start date"
   })
   projectStartDate!: Date

   @Field(_type => Date, {
      nullable: true,
      description: "Project's end date. If not set, then project it is still ongoing."
   })
   projectEndDate?: Date | undefined

   @Field(_type => [ProjectSourceCreateInput], {
      nullable: true,
      description: "Project's sources. Contains a link to the source and its type: website, github, more-info, related and custom."
   })
   sources!: ProjectSourceCreateInput[]
}

@ArgsType()
class ModifyProjectArgs {
   @Field(_type => String, {
      nullable: false,
      description: "The project's ID."
   })
   id!: string

   @Field(_type => MutateProjectArgsData, { 
      nullable: false,
      description: "The project's update data."
   })
   data!: MutateProjectArgsData
}



//* Get all projects query results types
interface ProjectsType {
   frontmatter: {
      image: ProjectPrismaType['image']
      projectName: ProjectPrismaType['projectName']
      projectDescription: ProjectPrismaType['projectDescription']
   }
   metadata: {
      startDate: ProjectPrismaType['projectStartDate']
      endDate: ProjectPrismaType['projectEndDate']
      topics: ProjectPrismaType['topics']
      scopes?: ProjectPrismaType['projectScope']
      techStack: ProjectPrismaType['techStack']
   }
   sources: ProjectPrismaType['sources']
}

@ObjectType("ProjectFrontMatter", {
   isAbstract: true
})
class ProjectFrontMatter {
   @Field(_type => String, {
      nullable: false,
      description: "The project's main illustration image."
   })
   image!: string
   
   @Field(_type => ProjectTextLocales, {
      nullable: false,
      description: "Project name in three languages: English, French, and Brazilian Portuguese."
   })
   projectName!: ProjectPrismaType['projectName']

   @Field(_type => ProjectTextLocales, {
      nullable: false,
      description: "Project description in three languages: English, French, and Brazilian Portuguese."
   })
   projectDescription!: ProjectPrismaType['projectDescription']
}
@ObjectType("ProjectMetadata", {
   isAbstract: true
})
class ProjectMetadata {
   @Field(_type => Date, {
      nullable: false,
      description: "Project's start date"
   })
   startDate!: Date

   @Field(_type => Date, {
      nullable: true,
      description: "Project's end date. If not set, then project it is still ongoing."
   })
   endDate?: Date | undefined

   @Field(_type => [String], {
      nullable: false,
      description: "Project's topics"
   })
   topics!: string[]

   @Field(_type => ProjectScopes, {
      nullable: true,
      description: "This project's scopes"
   })
   scopes?: ProjectScopes

   @Field(_type => [TechStack], {
      nullable: false,
      description: "Project's tech stack"
   })
   techStack!: ProjectPrismaType['techStack']
}
@ObjectType("ProjectFormatted", {
   isAbstract: true
})
class Project {
   @Field(_type => ProjectFrontMatter, {
      nullable: false,
      description: "Project's front matter"
   })
   frontmatter!: ProjectFrontMatter

   @Field(_type => [ProjectMetadata], {
      nullable: false,
      description: "Project's metadata"
   })
   metadata!: ProjectMetadata[]

   @Field(_type => ProjectSource, {
      nullable: false,
      description: "Project's sources"
   })
   sources!: ProjectSource[]
}




@Resolver(_of => Project)
export class ProjectResolver {
   @Query(_returns => [Project], { nullable: true })
   async getAllProjects(
      @Ctx() { prisma }: ApolloContext
      ): Promise<ProjectsType[] | null> {
      const rawDBRes =  await prisma.project.findMany({
         where: { isArchived: false }
      })

      const projects = rawDBRes.map(project => {
         const projectFormated = {
            frontmatter: {
               image: project.image,
               projectName: project.projectName,
               projectDescription: project.projectDescription
            },
            metadata: {
               scopes: project.projectScope,
               topics: project.topics,
               startDate: project.projectStartDate,
               endDate: project.projectEndDate,
               techStack: project.techStack
            },
            sources: project.sources
         }

         return projectFormated
      })

      return projects
   }

   @Authorized("sudo", "is:tumex")
   @Mutation(_returns => ProjectPrismaType, { nullable: false })
   async createProject(
      @Ctx() { prisma }: ApolloContext,
      @Args() data: MutateProjectArgsData
      ): Promise<ProjectPrismaType> {
      return await prisma.project.create({
         data: {
            ...data,
            projectStartDate: new Date(data.projectStartDate),
            projectEndDate: data.projectEndDate ? new Date(data.projectEndDate) : undefined
         }
      })
   }

   @Authorized("sudo", "is:tumex")
   @Mutation(_returns => ProjectPrismaType, { nullable: true })
   async updateProject(
      @Ctx() { prisma }: ApolloContext,
      @Args() { data, id }: ModifyProjectArgs
      ): Promise<ProjectPrismaType | null> {
      //* To make things easier the mutation opts-out of using [key]: { set: value } format
      //* so we need to process this data ourselves into prisma format

      //* rawData removes undefined values from the data objects and maps it to the prisma format
      const rawData = Object.entries(data).filter(([key, value]) => value !== undefined)
         .map(([key, value]) => ({ [key]: { set: value } }))

      //* uploadData transforms the above rawData array intro an object that prisma can use
      const uploadData: PrismaUpdateProjectArgs['data'] = 
         Object.assign({}, ...rawData)

      return await prisma.project.update({
         where: { id },
         data: uploadData
      })
   }

   @Authorized("sudo", "is:tumex")
   @Mutation(_returns => ProjectPrismaType, { nullable: true }) 
   async deleteProject(
      @Ctx() { prisma }: ApolloContext,
      @Arg("id", _type => String, { 
         nullable: false,
         description: "The project to be delete ID's."
      }) id: string): Promise<ProjectPrismaType> {
      return await prisma.project.delete({
         where: { id }
      })
   }
}
