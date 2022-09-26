import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'

import { IUserSchema } from 'interfaces/account'

const schema = new mongoose.Schema<IUserSchema>(
  {
    id: { type: String, unique: true, default: uuid() },
    avatar: { type: String },
    username: { type: String, unique: true, required: true, maxlength: 90 },
    email: { type: String, unique: true, required: true, maxlength: 90 },
    password: { type: String, unique: true, required: true, maxlength: 255 },
  },
  { timestamps: true }
)

export const User = mongoose.model('User', schema)
