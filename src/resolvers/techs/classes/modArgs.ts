import type { TechsType } from '../types'
import type { ProjectsFullResultType } from '../../projects/types'

import {
   ArgsType,
   Field,
   InputType
} from 'type-graphql'

import { arrayModInputFactory } from '@resolver-shared/classes/arrayModInputs'
import { quantifierInputFactory } from '@resolver-shared/classes/quantifIputs'
import { AuthMiddle } from '@middlewares/auth'
import { Scopes } from '@config/jwt-tkn'

//*-----------------------------------------------------------
//* Modify tech args

const ProjectIdArrayModInput = arrayModInputFactory<TechsType['id']>(String)

@InputType({
   isAbstract: true,
})
@ArgsType()
export class ModifyTechsArgs {
   @Field(_type => String, {
      nullable: false,
      description: 'The tech id to be updated'
   })
   id!: TechsType['id']

   @Field(_type => String, {
      nullable: true,
      description: 'Value to set the tech\' name to'
   })
   name?: TechsType['name']

   @Field(_type => String, {
      nullable: true,
      description: 'Value to set the tech\' logo to'
   })
   logo?: TechsType['logo'] | null

   @Field(_type => String, {
      nullable: true,
      description: 'Value to set the tech\' url to'
   })
   url?: TechsType['url'] | null
   
   @Field(_type => Number, {
      nullable: true,
      description: 'Value to set the tech\'s aprox projects use to'
   })
   aproxProjUse?: TechsType['aproxProjUse'] | null

   @Field(_type => Number, {
      nullable: true,
      description: 'Value to set the tech\'s aprox experience years to'
   })
   aproxExpYears?: TechsType['aproxExpYears'] | null

   @Field(_type => ProjectIdArrayModInput, {
      nullable: true,
      description: 'Modify the tech\'s to project relations.'
   })
   inProjects?: InstanceType<typeof ProjectIdArrayModInput>

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Value to set listAsSkill to'
   })
   listAsSkill?: TechsType['listAsSkill']

   @AuthMiddle({
      scopes: [Scopes.techHiddenEdit]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Value to set hidden to'
   })
   hidden?: TechsType['hidden']
}


//*-----------------------------------------------------------
//* Modify many tech args

@InputType()
class ModManyTechsSharedInputType {
   @AuthMiddle({
      scopes: [Scopes.techHiddenEdit]
   })
   @Field(() => Boolean, {
      nullable: true,
   })
   hidden?: boolean

   @Field(() => Boolean, {
      nullable: true,
   })
   listAsSkill?: boolean
}
   

@ArgsType()
export class ModManyTechsArgs {
   @Field(_type => [ModifyTechsArgs], {
      nullable: false,
      description: 'The techs to be updated'
   })
   data!: ModifyTechsArgs[]

   @Field(_type => ModManyTechsSharedInputType, {
      nullable: true,
      description: 'Modify the techs\'s to project relations.'
   })
   shared?: ModManyTechsSharedInputType
}

//*-----------------------------------------------------------
//* Modify techs in bulk args

//TODO Find a way to make this work with the factory
@InputType({
   isAbstract: true,
   description: 'Filter conditions.',
})
abstract class TechBulkModFilterCondInput {
   @Field(() => [TechBulkModFilterInput], {
      description: 'AND condition.',
      nullable: true,
   })
   AND?: TechBulkModFilterInput[]
   
   @Field(() => [TechBulkModFilterInput], {
      description: 'OR condition.',
      nullable: true,
   })
   OR?: TechBulkModFilterInput[]
   
   @Field(() => [TechBulkModFilterInput], {
      description: 'NOT condition.',
      nullable: true,
   })
   NOT?: TechBulkModFilterInput[]
}

const ModifyTechInProjInputType = quantifierInputFactory<ProjectsFullResultType['id']>(String)

@InputType({
   description: 'Filter techs that should be modified. e.g.: \'{ aproxProjUse: 5 }\' as filter will update all techs with a aproxProjUse of 5.'
})
class TechBulkModFilterInput extends TechBulkModFilterCondInput {
   @Field(() => Number, {
      nullable: true,
      description: 'The tech\'s aprox projects use to be updated'
   })
   aproxProjUse?: number

   @Field(() => Number, {
      nullable: true,
      description: 'The tech\'s aprox experience years to be updated'
   })
   aproxExpYears?: number

   //TODO Find a way to manipulate this simpler input and map every field like this to the more
   //! shitty and complex prisma input format
   //@Field(_type => ModifyTechInProjInputType, {
   //   nullable: true,
   //   description: 'Modify based on projects existing relationships.'
   //})
   //inProjects?: InstanceType<typeof ModifyTechInProjInputType>
}

@ArgsType()
export class ModTechsInBulkArgs {
   @Field(_type => [String], {
      nullable: true,
      description: 'The techs id to be updated. If not provided, all techs will be updated with the provided values.'
   })
   ids?: TechsType['id'][]
   
   @Field(_type => TechBulkModFilterInput, {
      nullable: true,
      description: 'Filter techs that should be modified. e.g.: \'{ aproxProjUse: 5 }\' as filter will update all techs with a aproxProjUse of 5.'
   })
   filter?: TechBulkModFilterInput

   @Field(_type => Boolean, {
      nullable: true,
      description: 'Value to set the techs\' listAsSkill to'
   })
   listAsSkill?: boolean

   @AuthMiddle({
      scopes: [Scopes.techHiddenEdit]
   })
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Value to set the techs\' hidden to'
   })
   hidden?: boolean

   @Field(_type => ProjectIdArrayModInput, {
      nullable: true,
      description: 'Modify the techs\' to project relations.'
   })
   inProjects?: InstanceType<typeof ProjectIdArrayModInput>

}
