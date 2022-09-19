import mongoose from 'mongoose'
import { v4 as uuid } from 'uuid'

import { ISession } from 'interfaces/account'

const schema = new mongoose.Schema<ISession>({
  id: { type: String, unique: true, default: uuid() },
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true },
})

export const Session = mongoose.model('Session', schema)
