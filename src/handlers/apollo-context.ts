import type { ApolloContext } from '~/index'
import type { ContextFunction } from 'apollo-server-core'
import type { Request } from 'express'
import type { Jwt } from 'jsonwebtoken'

import { prisma } from '@lib/prisma-client'
import { check } from '../auth/token-validation'
import { roleClaim, scopesClaim, machineScopesClaim } from '@config/jwt-tkn'
import { tumexRole } from '@config/env'
interface Err {
   code: number
   message: string
}

export interface ApolloContextExtension {
  auth: {
    token: {
      original: string
      decoded: Jwt
    }
    scopes: string[] | null
    roles: string[] | null
    isTumex: boolean
    authed: true
    invalidTkn: false
    err: null
  } | {
    token: null
    scopes: null
    roles: null
    isTumex: false
    
    authed: false
    invalidTkn: boolean
    err: Err | null
  }
}

export const context: ContextFunction<{req: Request}, ApolloContext> = async ({ req }): Promise<ApolloContext> => { 
  const authHeader = (req.headers.authorization ?? undefined) as string | undefined

  if(!authHeader || !authHeader.startsWith('Bearer ')) return { 
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      authed: false, err: null, invalidTkn: false
    }
  }
  
  const token = authHeader.replace('Bearer ', '')
  if(!token) return {
    prisma, auth: { 
      token: null, scopes: null, roles: null, isTumex: false,
      authed: false, err: null, invalidTkn: false
    }
  }
  
  const { decodedTkn, message, err } = await check(token)
  if (err !== null && err === 401) return {
    prisma, auth: {
      token: null, scopes: null, roles: null, isTumex: false,
      authed: false, err: null, invalidTkn: true
    }
  }
  if(err !== null) return {
    prisma, auth: {
      token: null, scopes: null, roles: null,
      authed: false, isTumex: false,
      err: { code: err, message }, invalidTkn: false
    }
  }

  const payload = typeof decodedTkn.payload === 'string' ? 
    JSON.parse(decodedTkn.payload) : decodedTkn.payload
  
  const whichScoClaim = scopesClaim in payload ? scopesClaim
   : machineScopesClaim in payload ? machineScopesClaim : null

  const scopes = typeof whichScoClaim === null ? null 
    : Array.isArray(payload[whichScoClaim!]) ? 
      payload[whichScoClaim!] as string[] 
      : payload[whichScoClaim!].split(',') as string[]

  const roles = typeof whichScoClaim === null ? null 
    : Array.isArray(payload[whichScoClaim!]) ? 
      payload[whichScoClaim!] as string[] 
      : payload[whichScoClaim!].split(',') as string[]
  
  return { 
    prisma, 
    auth: {
      token: { original: token, decoded: decodedTkn },
      scopes: scopes ?? null,
      roles: roles ?? null,
      isTumex: scopes?.includes(tumexRole) ? true : false,
      authed: true,
      invalidTkn: false,
      err: null,
    }
  }
}
