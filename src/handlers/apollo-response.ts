import type { Config } from 'apollo-server-core'

export const formatError: Config['formatError'] = (error) => {
   const defaultErr = {
      message: error.message,
   }

   //* Auth related errors
   if(error.message.startsWith('Access denied!')) return {
      message: 'Access denied!',
      path: error.path,
      extensions: {
         code: '401',
      }
   }

   //* Other errors
   if(!error.extensions || !error.extensions.code) return defaultErr
   else if(error.extensions.code === 'INTERNAL_SERVER_ERROR') {
      console.error(JSON.stringify(error, null, 2))
      return {
         message: 'Internal server error! This is our fault sorry!',
      }
   }

   return defaultErr
}