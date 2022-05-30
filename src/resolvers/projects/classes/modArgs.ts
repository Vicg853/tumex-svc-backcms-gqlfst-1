import type { ProjectsFullResultType } from '../types'

import { Field, ArgsType, InputType, ClassType } from 'type-graphql'
import {
   ResourceCreateInput,
   LocalesCreateInput,
   ProjectScopes,
} from '@prisma-gen/type-graphql'
import {
   ModProjToProjRelation,
   ModProjectTechStack
} from './relModArgs'

function arrayModifyCreate<T extends ClassType>(fieldName: string, FielClassType: T) {
   @InputType(`${fieldName}ModifyInput`, { isAbstract: true })
   abstract class ArrayModifyInputTypeClass {
      @Field(_type => [FielClassType], {
         nullable: true,
         description: `Set ${fieldName} resource array to`
      })
      setTo?: T[] 
   
   
      @Field(_type => [FielClassType], {
         nullable: true,
         description: `Append new project's ${fieldName}`
      })
      append?: T[]
   
      @Field(_type => [FielClassType], {
         nullable: true,
         description: `Omit project's ${fieldName}`
      })
      omit?: T[]
   }

   return ArrayModifyInputTypeClass
}


const ProjectResourceMod = arrayModifyCreate('resource', ResourceCreateInput)
const GhRepoMod = arrayModifyCreate('ghRepo', String)
const WebsiteMod = arrayModifyCreate('website', String)

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

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s topics (e.g.: Backend, Frontend, etc.)'
   })
   topics?: ProjectsFullResultType['topics']

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
      nullable: false,
      description: 'Project\'s start date'
   })
   startDate!: ProjectsFullResultType['startDate'];

   @Field(_type => Date, {
      nullable: true,
      description: 'Project\'s end date. Leave undefined in case project is still ongoing.'
   })
   endDate?: ProjectsFullResultType['endDate']

   @Field(_type => ModProjToProjRelation, {
      nullable: true,
      description: 'Project\'s to project relation updates'
   })
   projectToProjectRelUpdate?: ModProjToProjRelation

   @Field(_type => ModProjectTechStack, {
      nullable: true,
      description: 'Project\'s tech stack updates'
   })
   projectTechStackUpdate?: ModProjectTechStack
}

class ProjectOpacityRelatedUpdates {
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Project\'s visibility'
   })
   visibility?: boolean

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

   @Field(_type => ModProjectData, {
      nullable: true,
      description: "The project's data to modify"
   })
   data?: ModProjectData

   @Field(_type => [String], {
      nullable: true,
      description: 'Project\'s opacity related updates'
   })
   opacityUpdate?: ProjectOpacityRelatedUpdates
}