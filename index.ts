import { startServer  } from '~/index'
import { schemaGen } from '~/schema'

(async () => {
   console.log("⬇📴 Starting server...")
   await startServer(await schemaGen())
})()