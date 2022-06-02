import {
   Locales,
   ObjectiveProgress
} from '@prisma-gen/type-graphql'
import {
   Authorized,
   Field,
   ObjectType
} from 'type-graphql'

import {
   ObjectiveMainType
} from '../types'

@ObjectType()
export class ObjectiveQueryFields {
   @Field(_type => String, {
      nullable: true,
      description: 'Get a objective\'s id'
   })
   id?: string

   @Field(_type => Date, {
      nullable: true,
      description: 'Get a objective\'s creation date'
   })
   createdAt?: ObjectiveMainType['createdAt']

   @Field(_type => Locales, {
      nullable: true,
      description: 'Get title in different languages'
   })
   title?: ObjectiveMainType['title']

   @Field(_type => Locales, {
      nullable: true,
      description: 'Get description in different languages'
   })
   description?: ObjectiveMainType['description']

   @Field(_type => String, {
      nullable: true,
      description: 'Get source'
   })
   source?: ObjectiveMainType['source']

   @Field(_type => Number, {
      nullable: true,
      description: 'Get year objectives\'s year'
   })
   year?: ObjectiveMainType['year']

   @Field(_type => ObjectiveProgress, {
      nullable: true,
      description: 'Get objectives\'s progress'
   })
   progress?: ObjectiveMainType['progress']

   @Authorized('SUDO')
   @Field(_type => Boolean, {
      nullable: true,
      description: 'Get if objectives\'s hidden'
   })
   hidden?: ObjectiveMainType['hidden']
}  