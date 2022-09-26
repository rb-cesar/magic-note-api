import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'

import { IUserSchema } from 'interfaces/account'
import { User } from 'models/User'
import { createTokenProvider } from 'providers/tokenProvider'
import { shouldReturnOnly } from 'utils/objectHandler'
import { createAccountValidator } from 'validators/accountValidator'
import { Session } from 'models/Session'
import { NoteGroup } from 'models/Note'

type UserRequestType = Omit<IUserSchema, 'id' | 'createdAt' | 'updatedAt'>

type UserLoginRequestType = Omit<UserRequestType, 'email'>

type RefreshTokenRequestType = {
  sessionId: string
}

const accountValidator = createAccountValidator()
const tokenProvider = createTokenProvider()

// ------------------------------------------- // ------------------------------------------- //

export const signOn: RequestHandler<any, any, UserRequestType> = async (req, res) => {
  const { username, email, password } = req.body || {}

  const { ableToCreate } = accountValidator
  const { error, status, message } = await ableToCreate({ username, email, password })

  if (error) {
    return res.status(status).json({ error, status, message })
  }

  const hashedPassword = await hash(password, 10)
  const user = await User.create({ username, email, password: hashedPassword })
  const userResponse = shouldReturnOnly(user, ['id', 'username', 'email', 'createdAt', 'updatedAt'])

  const { generateToken, generateRefreshTokenSession } = tokenProvider
  const token = generateToken(userResponse.id)
  const refreshTokenSession = await generateRefreshTokenSession(userResponse.id)

  await NoteGroup.create({ creatorId: user.id, name: 'Notes' })

  return res.status(201).json({
    user: userResponse,
    token,
    session: refreshTokenSession,
  })
}

// ------------------------------------------- // ------------------------------------------- //

export const signIn: RequestHandler<any, any, UserLoginRequestType> = async (req, res) => {
  const { username, password } = req.body
  const { ableToSignIn, ableToSignInProcess } = accountValidator

  const initialValidation = await ableToSignInProcess({ username, password })

  if (initialValidation.error) {
    const { error, status, message } = initialValidation
    return res.status(status).json({ error, status, message })
  }

  const user = (await User.findOne({ username }))!
  const { error, status, message } = await ableToSignIn({ username, password, user })

  if (error) {
    return res.status(status).json({ error, status, message })
  }

  await Session.deleteMany({ userId: user.id })

  const { generateToken, generateRefreshTokenSession } = tokenProvider
  const token = generateToken(user?.id!)
  const refreshTokenSession = await generateRefreshTokenSession(user?.id!)

  const userResponse = shouldReturnOnly(user, ['id', 'avatar','username', 'email', 'createdAt', 'updatedAt'])

  return res.status(200).json({
    user: userResponse,
    token,
    session: refreshTokenSession,
  })
}

// ------------------------------------------- // ------------------------------------------- //

export const refreshToken: RequestHandler<RefreshTokenRequestType> = async (req, res) => {
  const { sessionId } = req.params
  const { ableToRefreshAuthorization } = accountValidator

  const authRefreshToken = req.headers['authorization']?.split(' ')[1]!
  const session = (await Session.findOne({ id: sessionId }))!

  const { error, status, message } = await ableToRefreshAuthorization({ authRefreshToken, session })

  if (error) {
    return res.status(status).json({ error, status, message })
  }

  const decodedAuthorizationRefreshToken: any = jwt.decode(authRefreshToken)
  const { userId } = decodedAuthorizationRefreshToken

  await Session.deleteMany({ userId })

  const { generateToken, generateRefreshTokenSession } = tokenProvider
  const token = generateToken(userId)
  const refreshTokenSession = await generateRefreshTokenSession(userId)

  return res.status(200).json({ token, session: refreshTokenSession })
}

// ------------------------------------------- // ------------------------------------------- //

export const showUser: RequestHandler<{ userId: string }> = async (req, res) => {
  const { userId } = req.params
  const { ableToShow } = accountValidator
  const { error, status, message } = ableToShow(userId)

  if (error) {
    return res.status(status).json({ error, status, message })
  }

  const user = await User.findOne({ id: userId })

  if (!user) {
    return res.status(404).json({ error: true, status: 404, message: 'User not found' })
  }

  const userResponse = shouldReturnOnly(user, ['id', 'avatar', 'username', 'email', 'createdAt', 'updatedAt'])

  return res.status(200).json(userResponse)
}

// ------------------------------------------- // ------------------------------------------- //
