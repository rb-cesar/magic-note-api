import { Router } from 'express'
import { autheticationMiddleware } from 'middlewares/authenticationMiddleware'
import * as accountController from 'controllers/accountController'
import * as noteController from 'controllers/noteController'

const router = Router()

// ------------------------------------------- // ------------------------------------------- //

router.post('/account/sign-on', accountController.signOn)

router.post('/account/sign-in', accountController.signIn)

router.get('/account/session/:sessionId', accountController.refreshToken)

router.get('/account/show/:userId', autheticationMiddleware, accountController.showUser)

// ------------------------------------------- // ------------------------------------------- //

router.post('/note/create-note', autheticationMiddleware, noteController.createNote)

router.post('/note/create-group', autheticationMiddleware, noteController.createGroup)

router.get('/note/groups', autheticationMiddleware, noteController.getGroup)

router.get('/note/groups/:groupId', autheticationMiddleware, noteController.getGroup)

// ------------------------------------------- // ------------------------------------------- //

export { router }
