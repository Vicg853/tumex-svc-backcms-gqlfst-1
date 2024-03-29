import type { ProjectsFullResultType } from '../types'

import { 
   Field, 
   ArgsType, 
   InputType, 
   ClassType 
} from 'type-graphql'
import {
   ResourceCreateInput,
   LocalesCreateInput,
   ProjectScopes
} from '@prisma-gen/type-graphql'

import {
   ModProjToProjRelated,
   ModProjToProjAsRelatee,
   ModProjectTechStack
} from './relModArgs'
import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

export interface ArrayModifyInputClassType {
   setTo: any[]
   append: any[]
   omit: any[]
}
function arrayModifyCreate<U>(fieldName: string, FielClassType: ClassType) {
   @InputType(`${fieldName}ModifyInput`, { isAbstract: true })
   abstract class ArrayModifyInputTypeClass {
      @Field(_type => [FielClassType], {
         nullable: true,
         description: `Set ${fieldName} resource array to`
      })
      set?: U[] 
   
   
      @Field(_type => [FielClassType], {
         nullable: true,
         description: `Append new project's ${fieldName}`
      })
      push?: U[]
   }

   return ArrayModifyInputTypeClass
}


const ProjectResourceMod = arrayModifyCreate<ResourceCreateInput>('resource', ResourceCreateInput)
const TopicsMod = arrayModifyCreate<string>('topic', String)
const GhRepoMod = arrayModifyCreate<string>('ghRepo', String)
const WebsiteMod = arrayModifyCreate<string>('website', String)

@InputType('ModifyProjectsData', {
   isAbstract: true
})
export class ModProjectData {
   @Field(_type => LocalesCreateInput, {
      nullable: true,
      description: "The project's title"
   })
   title!: ProjectsFullResultType['title']

   @Field(_type => LocalesCreateInput, {
      nullable: true,
      description: "The project's description"
   })
   description!: ProjectsFullResultType['description']

   @Field(_type => ProjectScopes, {
      nullable: true,
      description: 'Project\'s scope'
   })
   scopes!: ProjectsFullResultType['scopes']

   @Field(_type => TopicsMod, {
      nullable: true,
      description: 'Project\'s topics (e.g.: Backend, Frontend, etc.)'
   })
   topics?: InstanceType<typeof TopicsMod>

   @Field(_type => String, {
      nullable: true,
      description: "The project's image"
   })
   image!: ProjectsFullResultType['image']

   @Field(_type => ProjectResourceMod, {
      nullable: true,
      description: 'Project\'s related resources'
   }) 
   resources?: InstanceType<typeof ProjectResourceMod>;

   @Field(_type => GhRepoMod, {
      nullable: true,
      description: "The project's github repository"
   })
   ghRepo!: InstanceType<typeof GhRepoMod>

   @Field(_type => WebsiteMod, {
      nullable: true,
      description: 'Project\'s websites'
   })
   website?: InstanceType<typeof WebsiteMod>;

   @Field(_type => Date, {
      nullable: true,
      description: 'Project\'s start date'
   })
   startDate?: ProjectsFullResultType['startDate'];

   @Field(_type => Date, {
      nullable: true,
      description: 'Project\'s end date. Leave undefined in case project is still ongoing.'
   })
   endDate?: ProjectsFullResultType['endDate']
}

@InputType('ModifyOnlyProjectsData', {
   isAbstract: true
})
class ProjectAndRelationsModData extends ModProjectData {
   @Field(_type => ModProjToProjRelated, {
      nullable: true,
      description: 'Update project\'s list related to the current one.'
   })
   relatedProjectsUpdate?: ModProjToProjRelated
   
   @Field(_type => ModProjToProjAsRelatee, {
      nullable: true,
      description: 'Update project\'s list of project this one is a relatee of.'
   })
   relateeProjectsUpdate?: ModProjToProjAsRelatee

   @Field(_type => ModProjectTechStack, {
      nullable: true,
      description: 'Project\'s tech stack updates'
   })
   techStackUpdate?: ModProjectTechStack
}

@InputType('ModifyProjectOpacity', {
   isAbstract: true
})
class ProjectOpacityRelatedUpdates {
   @AuthMiddle({
      scopes: [Scopes.projectsHiddenEdit]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Project\'s visibility'
   })
   hidden?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Project\'s archive state'
   })
   archived?: boolean
}

@ArgsType()
export class ModProjectArgs {
   @Field(_type => String, {
      nullable: false,
      description: "The project's id"
   })
   id!: string

   @Field(_type => ProjectAndRelationsModData, {
      nullable: true,
      description: "The project's data to modify"
   })
   data?: ProjectAndRelationsModData

   @Field(_type => ProjectOpacityRelatedUpdates, {
      nullable: true,
      description: 'Project\'s opacity related updates'
   })
   opacityUpdate?: ProjectOpacityRelatedUpdates
}

@ArgsType()
export class ModProjectsOpacityArgs {
   @Field(_type => [String], {
      nullable: true,
      description: 'Project(s)\'s ids to modify. If not provided, all projects will be modified!'
   })
   ids?: string[]

   @AuthMiddle({
      scopes: [Scopes.projectsHiddenEdit]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Project(s)\'s visibility'
   })
   hidden?: boolean

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Project(s)\'s archive state'
   })
   archived?: boolean
}
