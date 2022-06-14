import type { RequireOnlyOne } from '~/../types/typefunc'
import type { ApolloContext } from '../index'
import { MiddlewareFn, UseMiddleware } from 'type-graphql'

import { ApolloError } from 'apollo-server-core'

type UserRequirements = RequireOnlyOne<{
  oneRole: string[]
  roles: string[]
}>

type UserAtLeastOneRequirements = RequireOnlyOne<{
  oneScope: string[]
  scopes: string[]
}>

type AuthMiddlewareType = Partial< 
  UserRequirements & 
  UserAtLeastOneRequirements & {
  ignoreMinRole?: boolean
}>

export function Auth({
  oneRole, roles,
  oneScope, scopes,
  ignoreMinRole = false,
}: AuthMiddlewareType): MiddlewareFn {
  return async ({ context }, next) => {
    const ctx = context as ApolloContext
    if(!ctx.auth.authed) {
      if(ctx.auth.err) 
        throw new ApolloError('Error trying to check authorization. This is our fault don\'t whory', '500')
      else if(ctx.auth.invalidTkn)
	      throw new ApolloError('Invalid token', '498')
      else 
        throw new ApolloError('Not authorized', '401')
    } 
    console.log('usr.scopes', ctx.auth.scopes)
    console.log('usr.roles', ctx.auth.roles)
    if(ctx.auth.isTumex) 
      return next()
    if(!ctx.auth.hasMinRole
      && !ignoreMinRole)
      throw new ApolloError('Not authorized', '403')
      
    if(!oneRole && !roles
      && !oneScope && !scopes)
      return next()

    //* Role and scope checks
    //* Explainning what is going on here:
    //* 1. First we check if the called Middleware has the roles/oneRole/scopes/oneScope
    //* even defined. If not, we simply skip other verifications which sums up to 
    //* to it not throwing unauthorized (consequnace of the && operator)
    //* 2. If it is defined, we check if the respecitve user roles anad scopes claims 
    //* are present in its jwt. If not, this will return true, by consequence 
    //* the following will happen if(true && true) which will throw an unauthorized error.
    //* 3. Else following the || operator we will finally check
    //* if the user has the required roles/scopes.
    //*   - If we are checking if user has at least one role or scope
    //*     (oneRole/oneScope), we will iterate through it with the .some
    //*     method, checking if user .includes the role/scope.
    //*     if one of them is true, .some will point to true and
    //*     as we ! before it, it will return false, resulting in 
    //*     if(true && (false || false)) -> not throwing unauthorized
    //*   - otherwise if it is (roles/scopes), we will iterate through it
    //*     with the .every method, doing the same check as above.
    //*     if all of them are true, .every will point to true and
    //*     as we use ! before it, it will return false, resulting in
    //*     if(true && (false && false)) -> not throwing unauthorized
    //*   In both cases, if the oposite occurs, unauthorized will be thrown
    if(oneRole && (ctx.auth.roles === null
      || ctx.auth.roles === undefined
      || !oneRole.some(role =>
      ctx.auth.roles!.includes(role))))
      throw new ApolloError('Not authorized', '403')

    if(roles && (ctx.auth.roles === null
      || ctx.auth.roles === undefined
      || !roles.every(role => 
      ctx.auth.roles!.includes(role)))) 
      throw new ApolloError('Not authorized', '403')

    if(oneScope && (ctx.auth.scopes === null
      || ctx.auth.scopes === undefined
      || !oneScope.some(scope =>
      ctx.auth.scopes!.includes(scope))))
      throw new ApolloError('Not authorized', '403')

    if(scopes && (ctx.auth.scopes === null
      || ctx.auth.scopes === undefined
      || !scopes.every(scope =>
      ctx.auth.scopes!.includes(scope))))
      throw new ApolloError('Not authorized', '403')
    //* End of role and scope checks
 
    return next()
  }
}

export const AuthMiddle = (props: AuthMiddlewareType) => UseMiddleware(Auth(props))