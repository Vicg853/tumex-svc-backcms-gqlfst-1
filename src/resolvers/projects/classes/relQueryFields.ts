import { Field, ObjectType } from 'type-graphql'
import {
   ProjectResult
} from './queryFields'


@ObjectType('ProjectRelateesQueryFields', {
   isAbstract: true
})
export class ProjectRelateesQueryFields {
   @Field(_type => ProjectResult, {
      nullable: false,
      description: 'Project'
   })
   project!: ProjectResult

   @Field(_type => [ProjectResult], {
      nullable: false,
      description: 'Project\'s relatees'
   })
   relatees!: ProjectResult[]
}