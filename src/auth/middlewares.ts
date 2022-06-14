import type { ApolloContext } from '../index'
import type { AuthChecker } from 'type-graphql'

import { ApolloError } from 'apollo-server-core'

export const authChecker: AuthChecker<ApolloContext> = (
   { context }, reqScopes ) => {
   console.log('Auth context', JSON.stringify(context.auth, null, 2))
   if(!reqScopes) return true

   if(!context.auth.authed) {
      if(context.auth.err) 
        throw new ApolloError('Error trying to check authorization. This is our fault don\'t whory', 'INTERNAL_SERVER_ERROR')
      else return false
   } 

   if(context.auth.isTumex) return true
   if(!context.auth.hasMinSope) return false
   if(!context.auth.scopes.some(scope => 
     reqScopes.includes(scope))) return false
   
   return true
}
