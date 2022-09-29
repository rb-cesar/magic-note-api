import { RequestHandler } from 'express'
import { v4 as uuid } from 'uuid'
import { INoteSchema } from 'interfaces/note'
import { Note, NoteGroup } from 'models/Note'
import { StorageService } from 'services/StorageService'
import { shouldReturnOnly } from 'utils/objectHandler'
import { validate } from 'validators/globalValidator'

type NoteResponseType = {
  groupId: string
} & Omit<INoteSchema, 'id' | 'creatorId' | 'createdAt' | 'updatedAt'>

export const createNote: RequestHandler<any, any, NoteResponseType> = async (req, res) => {
  const { groupId, description, type, checked } = req.body || {}
  const { file } = req

  const { error, status, message } = await validate(null, [
    () => ({
      error: !groupId,
      status: 422,
      message: 'groupId is required',
    }),
    () => ({
      error: !description,
      status: 422,
      message: 'description is required',
    }),
    () => ({
      error: !type,
      status: 422,
      message: 'type is required',
    }),
  ])

  if (error) {
    return res.status(status).json({ error, status, message })
  }

  const image = {
    current: '',
  }

  if (file) {
    const storage = new StorageService('image')

    const { validation, data } = await storage.upload('images', file)
    const { error, status, message } = validation

    if (error) {
      return res.status(status).json({ error, status, message })
    }

    image.current = data?.Key!
  }

  const { userId } = req.cookies

  try {
    const createdNote = await Note.create({
      id: uuid(),
      creatorId: userId,
      type,
      groupId,
      description,
      imageUrl: image.current || undefined,
      checked,
    })

    const dataNote = shouldReturnOnly(createdNote, [
      'id',
      'creatorId',
      'groupId',
      'imageUrl',
      'description',
      'type',
      'createdAt',
      'updatedAt',
    ])

    return res.status(201).json(dataNote)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: true, status: 500, message: 'internal server error' })
  }
}

export const deleteNote: RequestHandler<{ noteId: string }> = async (req, res) => {
  const { noteId } = req.params

  const note = (await Note.findOne({ id: noteId }))!
  const storage = new StorageService('image')

  if (note?.imageUrl) {
    await storage.delete(note.imageUrl)
  }

  await note?.delete()

  return res.status(204).send()
}

export const createGroup: RequestHandler<any, any, { name: string }> = async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.status(422).json({ error: true, status: 422, message: 'name is required' })
  }

  try {
    const group = await NoteGroup.create({ name, creatorId: req.cookies.userId })
    const dataGroup = shouldReturnOnly(group, ['id', 'creatorId', 'name', 'createdAt', 'updatedAt'])

    return res.status(201).json(dataGroup)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: true, status: 500, message: 'internal server error' })
  }
}

export const getGroup: RequestHandler<{ groupId: string }> = async (req, res) => {
  const { groupId } = req.params

  if (!groupId) {
    const { userId } = req.cookies

    const groups = await NoteGroup.find({ creatorId: userId })
    const notes = await Note.find({ creatorId: userId })

    const data = groups.map(group => {
      const findedNotes = notes.filter(note => note.groupId === group.id)
      const dataGroup = shouldReturnOnly(group, ['id', 'name', 'creatorId', 'createdAt', 'updatedAt'])
      const dataNotes = findedNotes.map(n => {
        return shouldReturnOnly(n, ['id', 'groupId', 'creatorId', 'imageUrl', 'description', 'createdAt', 'updatedAt'])
      })

      return {
        ...dataGroup,
        notes: dataNotes,
      }
    })

    return res.status(200).json(data)
  }

  const group = (await NoteGroup.findOne({ id: groupId }))!
  const notes = (await Note.find({ groupId }))!

  const dataGroup = shouldReturnOnly(group, ['id', 'name', 'creatorId', 'createdAt', 'updatedAt'])
  const dataNotes = notes.map(n => {
    return shouldReturnOnly(n, ['id', 'groupId', 'creatorId', 'imageUrl', 'description', 'createdAt', 'updatedAt'])
  })

  return res.status(200).json({ ...dataGroup, notes: dataNotes })
}
