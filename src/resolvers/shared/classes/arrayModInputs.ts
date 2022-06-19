import type { ClassType } from 'type-graphql'

import {
   Field,
   InputType
} from 'type-graphql'


export function arrayModInputFactory<T>(ArrayModClass: ClassType) {
   @InputType({
      description: 'Array modifier input type.',
      isAbstract: true,
   })
   abstract class ArrayModInputType {
      @Field(() => [ArrayModClass], {
         nullable: true,
      })
      push?: T[]

      @Field(() => [String], {
         nullable: true,
      })
      omit?: T[]
   }

   return ArrayModInputType
}