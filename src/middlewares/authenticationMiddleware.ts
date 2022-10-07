import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'

import { access } from '@app/config/access'

export const autheticationMiddleware: RequestHandler = (req, res, next) => {
  const authToken = req.headers['authorization']?.split(' ')[1]

  if (!authToken) {
    return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' })
  }

  try {
    jwt.verify(authToken, access.secret_access_key)

    const decodedToken: any = jwt.decode(authToken)

    req.cookies['userId'] = decodedToken.userId

    next()
  } catch (err) {
    return res.status(401).json({ error: true, status: 422, message: 'Unauthenticated' })
  }
}
