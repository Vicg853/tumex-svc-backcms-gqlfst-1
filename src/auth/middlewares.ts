import type { ApolloContext } from '../index'
import type { AuthChecker } from 'type-graphql'

import { ApolloError } from 'apollo-server-core'

export const authChecker: AuthChecker<ApolloContext> = (
   { context }, reqScopes ) => {
   if(!context.auth.authed) {
      if(context.auth.err) 
        throw new ApolloError('Error trying to check authorization. This is our fault don\'t whory', 'INTERNAL_SERVER_ERROR')
      else return false
   } 
   
   if(context.auth.isTumex) 
     return true
   if(!context.auth.hasMinSope) 
     return false

   if(!reqScopes) 
     return true

   const userScopes = context.auth.scopes
   return reqScopes.every(reqScope => userScopes.includes(reqScope))
}
