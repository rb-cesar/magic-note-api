import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import morgan from 'morgan'

import { uri } from '@app/config/access'
import { router } from '@app/routes/routes'

const app = express()
const whitelist = uri.domains.split(',').map(item => item.trim())

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
      app.use(morgan('dev'))
      app.use(router)
    },
    initializeCors() {
      app.use(
        cors({
          credentials: true,
          origin: function (origin, cb) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
              cb(null, true)
              return
            }

            cb(new Error('Not allowed CORS'))
          },
        })
      )
    },
  }
}

export function createApplication() {
  const { initializeDatabase } = createDatabaseInitializer()
  const { initializeMiddlawares, initializeCors } = createGlobalInitializer()

  const application = {
    async start() {
      try {
        await initializeDatabase()
        initializeMiddlawares()
        initializeCors()

        app.listen(uri.port)
      } catch (err: any) {
        console.error(err)
      }
    },
  }

  return application
}
