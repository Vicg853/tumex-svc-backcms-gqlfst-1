import type { Config } from 'apollo-server-core'

const httpCatsUrl = process.env.HTTP_CATS_URL

export const formatError: Config['formatError'] = (error) => {
   const defaultErr = {
      message: error.message,
      extensions: {
         httpCatCode: `${httpCatsUrl}/500`
      }
   }

   if(!error.extensions || !error.extensions.code) return defaultErr


   //* Auth related errors
   if(error.extensions.code === '401') return {
      message: 'Access denied!',
      path: error.path,
      extensions: {
         code: '401',
         httpCatCode: `${httpCatsUrl}/401`
      }
   }
   else if(error.extensions.code === '498') return {
      message: 'Invalid token',
      path: error.path,
      extensions: {
         code: '498',
	 httpCatCode: `${httpCatsUrl}/498`
      }
   } 
   else if(error.extensions.code === '403') return {
      message: 'Forbidden',
      path: error.path,
      extensions: {
         code: '403',
	 httpCatCode: `${httpCatsUrl}/403`
      }
   }
   
   //* Other errors
   if(error.extensions.code === 'INTERNAL_SERVER_ERROR'
	|| error.extensions.code === '500') {
      console.error(JSON.stringify(error, null, 2))
      return {
         message: error.message ?? 'Internal server error! This is our fault sorry!',
         extensions: {
            httpCatCode: `${httpCatsUrl}/500`
         }
      }
   } 
   else if(error.extensions.code === 'P2025') return {
   message: 'Invalid relation input: One or more of the provided Database relations do not exist or are invalid. e.g.: Related TechStack id does not exist',
      extensions: {
         code: '424',
         httpCatCode: `${httpCatsUrl}/424`
      }
   }
   else if(error.extensions.code === '406') return {
      message: `Invalid input: ${error.message}`,
      extensions: {
         code: '406',
         httpCatCode: `${httpCatsUrl}/406`
      }
   }
   else if (error.extensions.code === 'P2023') return {
      message: 'Invalid input created column inconsistency in the database. E.g.: Project id is invalid',
      extensions: {
         code: '406',
         httpCatCode: `${httpCatsUrl}/406`
      }
   }
   else if (error.extensions.code === 'P2002') return {
      message: `Unique constraint failed on the: ${error.message}`,
      extensions: {
         code: '409',
         httpCatCode: `${httpCatsUrl}/409`
      }
   }
   else if (error.extensions.code === '404') return {
      message: `Not found: ${error.message}`,
      extensions: {
         code: '404',
	 httpCatCode: `${httpCatsUrl}/404`
      }
   }


   return defaultErr
}
