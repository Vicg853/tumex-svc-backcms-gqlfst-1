import type { Config } from 'apollo-server-core'

const httpCatsUrl = process.env.HTTP_CATS_URL

export const formatError: Config['formatError'] = (error) => {
   const defaultErr = {
      message: error.message,
      extensions: {
         httpCatCode: `${httpCatsUrl}/500`
      }
   }

   //* Auth related errors
   if(error.message.startsWith('Access denied!')) return {
      message: 'Access denied!',
      path: error.path,
      extensions: {
         code: '401',
         httpCatCode: `${httpCatsUrl}/401`
      }
   }

   
   //* Other errors
   if(!error.extensions || !error.extensions.code) return defaultErr
   else if(error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error(JSON.stringify(error, null, 2))
      return {
         message: 'Internal server error! This is our fault sorry!',
         extensions: {
            httpCatCode: `${httpCatsUrl}/500`
         }
      }
   } 
   else if(error.extensions.code === 'P2025') return {
   message: 'Invalid relation input: One or more of the provided Database relations do not exist or are invalid.',
      extensions: {
         code: '424',
         httpCatCode: `${httpCatsUrl}/424`
      }
   }

   return defaultErr
}