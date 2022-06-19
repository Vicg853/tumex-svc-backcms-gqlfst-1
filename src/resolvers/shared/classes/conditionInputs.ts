import type { ClassType } from 'type-graphql'

import {
   Field,
   InputType
} from 'type-graphql'

export function conditionalInputFactory<T>(ConditionedClass: ClassType) {
   @InputType({
      isAbstract: true,
      description: 'Filter conditions.',
   })
   abstract class ConditionInputType {
      @Field(() => [ConditionedClass], {
         description: 'AND condition.',
         nullable: true,
      })
      AND?: T[]
      
      @Field(() => [ConditionedClass], {
         description: 'OR condition.',
         nullable: true,
      })
      OR?: T[]
      
      @Field(() => [ConditionedClass], {
         description: 'NOT condition.',
         nullable: true,
      })
      NOT?: T[]
   }

   return ConditionInputType
}