import type { JWTHeader, JWTPayload } from 'express-oauth2-jwt-bearer'
import type { JWKsPromise } from '@utils/pub-jwt-key'

import { verify } from 'jsonwebtoken'
import { auth } from 'express-oauth2-jwt-bearer'

import { CacheTknKeys } from '@utils/pub-jwt-key'

const cacheTknKeys = new CacheTknKeys()

const verifyMap = (token: string, secrets: JWKsPromise) => secrets.some(secret => {
  try {
    return verify(token, secret, {
      algorithms: ['RS256'],
      complete: true,     
    }) 
  } catch(err) { return false }
})

  
export const check = async (token: string) => {
  await cacheTknKeys.init()
  let jwtKeys = await cacheTknKeys.get()

  if(!jwtKeys) return {
    err: 500,
    message: 'Error occured with the JWT keys cache',
    keys: null,
  }

  let verifiedTkn = verifyMap(token, jwtKeys)

  if(!verifiedTkn) {
    await cacheTknKeys.reFetch()
    jwtKeys = await cacheTknKeys.get()
  }

  if(!jwtKeys) return {
    err: 500,
    message: 'Error occured with the JWT keys cache',
    keys: null,
  }

  verifiedTkn = verifyMap(token, jwtKeys)

  if(!verifiedTkn) return {
    err: 401,
    message: 'Invalid token',
    decodedTkn: null,
  }
 
  return {
    err: null,
    message: null,
    decodedTkn: verifiedTkn,
  }
}
