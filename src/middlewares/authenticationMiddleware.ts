import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import { uri } from 'config/access'

export const autheticationMiddleware: RequestHandler = (req, res, next) => {
  const authToken = req.headers['authorization']?.split(' ')[1]

  if (!authToken) {
    return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' })
  }

  try {
    jwt.verify(authToken, uri.secret_access_key)

    next()
  } catch (err) {
    return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' })
  }
}
