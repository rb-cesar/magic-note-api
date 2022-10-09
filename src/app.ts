import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

import { access, whitelist } from '@app/config/access'
import { router } from '@app/routes/routes'

const app = express()

function createDatabaseInitializer() {
  return {
    async initializeDatabase() {
      const connection = await mongoose.connect(access.db_access)
      return connection
    },
  }
}

function createGlobalInitializer() {
  return {
    initializeMiddlawares() {
      app.use(
        cors({
          credentials: true,
          origin: access.is_production ? whitelist : '*',
          methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'Origin', 'X-Requested-With'],
        })
      )
      app.use(express.json())
      app.use(express.urlencoded({ extended: true }))
      app.use(cookieParser())
      app.use(morgan('common'))
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

        app.listen(access.port)
      } catch (err: any) {
        console.error(err)
      }
    },
  }

  return application
}
