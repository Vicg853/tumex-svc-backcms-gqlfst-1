import type { TechsType } from '../types'

import {
   ArgsType,
   InputType,
   Field
} from 'type-graphql'

@InputType()
class CreateTechData {
   @Field(_type => String, {
      nullable: false,
      description: 'The technology\'s name'
   })
   name!: TechsType['name']

   @Field(_type => String, {
      nullable: true,
      description: 'The technology\'s logo'
   })
   logo?: TechsType['logo']

   @Field(_type => String, {
      nullable: true,
      description: 'The technology\'s source url'
   })
   url?: TechsType['url']

   @Field(_type => Number, {
      nullable: true,
      description: 'Years of experience with this technology'
   })
   aproxExpYears?: TechsType['aproxExpYears']

   @Field(_type => Number, {
      nullable: true,
      description: 'Aprox projects using this technology'
   })
   aproxProjUse?: TechsType['aproxProjUse']

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Define the initial "list as skill" state'
   })
   listAsSkill?: TechsType['listAsSkill']

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Defined initial hidden state. (if true it will not only be hidden in projects stacks, but also in the skills list).'
   })
   hidden?: TechsType['hidden']
}

@InputType()
class CreateTechSharedArgs {
   @Field(_type => Number, {
      nullable: true,
      description: 'Years of experience with this technology'
   })
   aproxExpYears?: TechsType['aproxExpYears']

   @Field(_type => Number, {
      nullable: true,
      description: 'Aprox projects using this technology'
   })
   aproxProjUse?: TechsType['aproxProjUse']

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Define the initial "list as skill" state'
   })
   listAsSkill?: TechsType['listAsSkill']

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Defined initial hidden state. (if true it will not only be hidden in projects stacks, but also in the skills list).'
   })
   hidden?: TechsType['hidden']
}

export type SharedDataType = InstanceType<typeof CreateTechArgs>['shared']

@ArgsType()
export class CreateTechArgs {
   @Field(_type => [CreateTechData], {
      nullable: false,
      description: 'The technologies\' data'
   })
   data!: CreateTechData[]

   @Field(_type => CreateTechSharedArgs, {
      nullable: true,
      description: 'The technologies shared data. (Note that defined values in data array will override this values)'
   })
   shared?: CreateTechSharedArgs
}




