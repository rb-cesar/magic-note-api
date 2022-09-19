import express from 'express'
import mongoose from 'mongoose'

import { uri } from 'config/access'
import { router } from 'routes/routes'

const { host, port } = uri

const app = express()

function createDatabaseInitializer() {
  return {
    async initializeDatabase() {
      const connection = await mongoose.connect(uri.db_access)
      return connection
    },
  }
}

function createGlobalInitializer() {
  return {
    initializeMiddlawares() {
      app.use(express.json())
      app.use(router)
    },
  }
}

export function createApplication() {
  const { initializeDatabase } = createDatabaseInitializer()
  const { initializeMiddlawares } = createGlobalInitializer()

  const application = {
    async start() {
      try {
        await initializeDatabase()
        initializeMiddlawares()

        app.listen(port, host, () => console.log(`Server running at http://${host}:${port}`))
      } catch (err: any) {
        console.error(err)
      }
    },
  }

  return application
}
