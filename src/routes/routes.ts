import { Router } from 'express'
import multer from 'multer'

import { autheticationMiddleware } from 'middlewares/authenticationMiddleware'

import * as accountController from 'controllers/accountController'
import { noteRouter } from './noteRoutes'

const router = Router()

// ------------------------------------------- // ------------------------------------------- //

router.post('/account/sign-on', accountController.signOn)

router.post('/account/sign-in', accountController.signIn)

router.put('/account/:userId', autheticationMiddleware, accountController.updateUser)

router.get('/account/session/:sessionId', accountController.refreshToken)

router.get('/account/show/:userId', autheticationMiddleware, accountController.showUser)

// ------------------------------------------- // ------------------------------------------- //

router.use(autheticationMiddleware, noteRouter)

// ------------------------------------------- // ------------------------------------------- //

export { router }
