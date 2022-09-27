import { Router } from 'express'

import * as noteController from 'controllers/noteController'

const noteRouter = Router()

// ------------------------------------------- // ------------------------------------------- //

noteRouter.post('/note/create-note', noteController.createNote)

noteRouter.post('/note/create-group', noteController.createGroup)

noteRouter.get('/note/groups', noteController.getGroup)

noteRouter.get('/note/groups/:groupId', noteController.getGroup)

// ------------------------------------------- // ------------------------------------------- //

export { noteRouter }
