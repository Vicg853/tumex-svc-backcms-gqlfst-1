import type { Jwt } from 'jsonwebtoken'
import type { JWKsPromise } from '@utils/pub-jwt-key'

import { verify } from 'jsonwebtoken'

import { CacheTknKeys } from '@utils/pub-jwt-key'

const cacheTknKeys = new CacheTknKeys()

const verifyMap = (token: string, secrets: JWKsPromise) => {
  let decoded: Jwt | undefined;
  for (const secret of secrets) {
    try {
      decoded = verify(token, secret, {
        algorithms: ['RS256'],
	complete: true,
      })

      break   
    } catch(err) { continue }
  }
  return decoded
}

  
export const check = async (token: string): Promise<{
  decodedTkn: Jwt
  err: null
  message: null
} | {
  decodedTkn: null
  err: number
  message: string
}> => {
  await cacheTknKeys.init()
  let jwtKeys = await cacheTknKeys.get()

  if(!jwtKeys) return {
    err: 500,
    message: 'Error occured with the JWT keys cache',
    decodedTkn: null,
  }

  let verifiedTkn = verifyMap(token, jwtKeys)

  if(!verifiedTkn) {
    await cacheTknKeys.reFetch()
    jwtKeys = await cacheTknKeys.get()
  }

  if(!jwtKeys) return {
    err: 500,
    message: 'Error occured with the JWT keys cache',
    decodedTkn: null,
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
