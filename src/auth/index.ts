import type { ApolloContext } from './../index'
import type { AuthChecker } from 'type-graphql'

export const authChecker: AuthChecker<ApolloContext> = (
   { root, args, context, info }, roles ) => {
   return true
}