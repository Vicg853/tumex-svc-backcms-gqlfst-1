import 'reflect-metadata'
import { buildSchema } from 'type-graphql'

import path from 'path'

import {
   FindManyObjectivesResolver   
} from "@prisma-gen/type-graphql/index"

export const schemaGen = async () => await buildSchema({
   resolvers: [
      FindManyObjectivesResolver
   ],
   emitSchemaFile: path.resolve(__dirname, '../generated-schema.graphql'),
   validate: true
})