import type { ClassType } from 'type-graphql'

import {
   Field,
   InputType
} from 'type-graphql'

export function quantifierInputFactory<T>(QuantifiedClass: ClassType) {
   @InputType({
      isAbstract: true,
      description: 'Quantifier input type.'
   })
   abstract class QuantifierInputType {
      @Field(() => [QuantifiedClass], {
         description: 'Some quantifier.',
         nullable: true,
      })
      some?: T[]

      @Field(() => [QuantifiedClass], {
         description: 'Every quantifier.',
         nullable: true,
      })
      every?: T[]

      @Field(() => [QuantifiedClass], {
         description: 'None quantifier.',
         nullable: true,
      })
      none?: T[]
   }

   return QuantifierInputType
}