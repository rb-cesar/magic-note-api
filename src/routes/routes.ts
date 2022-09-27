import { Router } from 'express'
import multer from 'multer'

import { createMulterConfig } from 'config/multer'
import { autheticationMiddleware } from 'middlewares/authenticationMiddleware'

import * as accountController from 'controllers/accountController'
import { noteRouter } from './noteRoutes'

const router = Router()
const multerConfig = createMulterConfig({
  path: 'avatar',
  maxMB: 2,
  allowedMimes: ['image/jpg', 'image/jpeg', 'image/png'],
})
const avatarMiddleware = multer(multerConfig).single('avatar')

// ------------------------------------------- // ------------------------------------------- //

router.post('/account/sign-on', accountController.signOn)

router.post('/account/sign-in', accountController.signIn)

router.put('/account/:userId', autheticationMiddleware, avatarMiddleware, accountController.updateUser)

router.get('/account/session/:sessionId', accountController.refreshToken)

router.get('/account/show/:userId', autheticationMiddleware, accountController.showUser)

// ------------------------------------------- // ------------------------------------------- //

router.use(autheticationMiddleware, noteRouter)

// ------------------------------------------- // ------------------------------------------- //

export { router }
