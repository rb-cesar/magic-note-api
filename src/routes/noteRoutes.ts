import { Router } from 'express'
import multer from 'multer'

import * as noteController from '@app/controllers/noteController'

const noteRouter = Router()

// ------------------------------------------- // ------------------------------------------- //

noteRouter.post('/note/create-note', multer().single('image'), noteController.createNote)

noteRouter.post('/note/create-group', noteController.createGroup)

noteRouter.delete('/note/delete/:noteId', noteController.deleteNote)

noteRouter.get('/note/groups', noteController.getGroup)

noteRouter.get('/note/groups/:groupId', noteController.getGroup)

// ------------------------------------------- // ------------------------------------------- //

export { noteRouter }
