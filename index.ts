import { startServer  } from '~/index'
import { schema } from '~/schema'

(async () => {
   console.log("⬆️ Starting server...")
   await startServer(schema)
})()
