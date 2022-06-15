import { 
   ObjectiveMainType 
} from '../types'
import { 
   ArgsType,
   Field, 
   InputType
} from 'type-graphql'
import { ArrayMaxSize } from 'class-validator'

import {
   LocalesCreateInput,
   ObjectiveProgress,
} from '@prisma-gen/type-graphql'

@InputType('CreateObjectiveInput', {
   description: 'Input for creating a new objectives.',
   isAbstract: true,
})
class CreateObjectiveInput {
   @Field(_type => LocalesCreateInput, { 
      description: 'The objective\'s titles in different locales.',
      nullable: false 
   })
   title!: ObjectiveMainType['title']

   @Field(_type => LocalesCreateInput, {
      description: 'The objective\'s descriptions in different locales.',
      nullable: false
   })
   description!: ObjectiveMainType['description']

   @Field(_type => ObjectiveProgress, {
      description: 'The objective\'s current progress state.',
      nullable: true
   })
   progress?: ObjectiveMainType['progress']

   @Field(_type => String, {
      description: 'The objective\'s source or related content.',
      nullable: true
   })
   source?: ObjectiveMainType['source']

   @Field(_type => Number, {
      description: 'The objective\'s year.',
      nullable: true
   })
   year?: ObjectiveMainType['year']

   @Field(_type => Boolean, {
      description: 'Whether the objective is hidden or not.',
      nullable: true
   })
   hidden?: ObjectiveMainType['hidden'] 
}

@InputType()
class GlobalCreateObjectiveInput {
   @Field(_type => ObjectiveProgress, {
      description: 'The objective\'s current progress state.',
      nullable: true
   })
   progress?: ObjectiveMainType['progress']  
   @Field(_type => String, {
      description: 'The objective\'s source or related content.',
      nullable: true
   })
   source?: ObjectiveMainType['source']   
   @Field(_type => Number, {
      description: 'The objective\'s year.',
      nullable: true
   })
   year?: ObjectiveMainType['year']

   @Field(_type => Boolean, {
      description: 'Whether the objective is hidden or not.',
      nullable: true
   })
   hidden?: ObjectiveMainType['hidden'] 
}

@ArgsType()
export class CreateObjectiveArgs {
   @Field(_type => GlobalCreateObjectiveInput, {
      description: 'Optional global values that will be assigned to all objectives. Note these will be overridden by the values in each objective.',
      nullable: true
   })
   globalInput?: GlobalCreateObjectiveInput

   @ArrayMaxSize(8)
   @Field(_type => [CreateObjectiveInput], {
      description: 'The objectives to create.',
      nullable: false
   })
   input!: CreateObjectiveInput[]
}