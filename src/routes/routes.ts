import { Router } from 'express'
import { autheticationMiddleware } from 'middlewares/authenticationMiddleware'
import * as accountController from 'controllers/accountController'

const router = Router()

// ------------------------------------------- // ------------------------------------------- //

router.post('/account/sign-on', accountController.signOn)

router.post('/account/sign-in', accountController.signIn)

router.get('/account/session/:sessionId', accountController.refreshToken)

router.get('/account/show/:userId', autheticationMiddleware, accountController.showUser)

// ------------------------------------------- // ------------------------------------------- //

export { router }
