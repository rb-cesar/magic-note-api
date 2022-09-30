import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import { uri } from '@app/config/access'
import { router } from '@app/routes/routes'

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
      app.use(express.urlencoded({ extended: true }))
      app.use(cookieParser())
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

        app.listen(uri.port)
      } catch (err: any) {
        console.error(err)
      }
    },
  }

  return application
}
