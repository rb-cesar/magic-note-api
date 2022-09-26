import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

import { uri } from 'config/access'
import { Session } from 'models/Session'

function getTime(value: string) {
  const date = new Date()

  date.setHours(Number(value.replace(/\D/, '')))

  return date.getTime()
}

export function createTokenProvider() {
  const tokenExpiresIn = '24h' // 1d
  const refreshTokenExpiresIn = '120h' // 5d

  let timeToExpiresToken = getTime(tokenExpiresIn)

  return {
    generateToken(userId: string) {
      const token = jwt.sign({ userId }, uri.secret_access_key, {
        expiresIn: tokenExpiresIn,
        subject: userId,
      })

      timeToExpiresToken = getTime(tokenExpiresIn)

      return token
    },
    async generateRefreshTokenSession(userId: string) {
      const refreshToken = jwt.sign({ userId, expiresIn: timeToExpiresToken }, uri.secret_access_key, {
        expiresIn: refreshTokenExpiresIn,
        subject: userId,
      })
      const session = await Session.create({
        id: uuid(),
        userId,
        refreshToken,
      })

      return {
        id: session.id,
        userId,
        refreshToken: session.refreshToken,
      }
    },
  }
}
