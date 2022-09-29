import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'
import { INoteGroupSchema, INoteSchema } from '@app/interfaces/note'

const noteSchema = new mongoose.Schema<INoteSchema>(
  {
    id: { type: String, unique: true, default: uuid() },
    groupId: { type: String, required: true },
    creatorId: { type: String, required: true },
    type: { type: String },
    imageUrl: { type: String },
    description: { type: String, required: true },
    checked: { type: Boolean },
  },
  { timestamps: true }
)

const noteGroupSchema = new mongoose.Schema<INoteGroupSchema>(
  {
    id: { type: String, unique: true, default: uuid() },
    creatorId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 90 },
  },
  { timestamps: true }
)

export const Note = mongoose.model('Note', noteSchema)

export const NoteGroup = mongoose.model('NoteGroup', noteGroupSchema)
