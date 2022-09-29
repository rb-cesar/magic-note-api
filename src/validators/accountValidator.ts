import jwt from 'jsonwebtoken'
import { Document, Types } from 'mongoose'
import { compare } from 'bcrypt'

import { User } from '@app/models/User'
import { ISessionSchema, IUserSchema } from '@app/interfaces/account'
import { validate } from '@app/validators/globalValidator'
import { uri } from '@app/config/access'
import { Session } from '@app/models/Session'

export type Result = {
  error: boolean
  status: number
  message: string
}

export type UserLoginType = Omit<IUserSchema, 'id' | 'createdAt' | 'updatedAt' | 'email'>

export type DBSession = Document<unknown, any, ISessionSchema> &
  ISessionSchema & {
    _id: Types.ObjectId
  }

export type DBUser = Document<unknown, any, IUserSchema> &
  IUserSchema & {
    _id: Types.ObjectId
  }

export type SessionValidationType = {
  authRefreshToken: string
  session: DBSession
}

export type UserValidationType = {
  username: string
  password: string
  user: DBUser
}

async function ableToCreate({ username, email, password }: Partial<Omit<IUserSchema, 'id'>>) {
  const { error, message, status } = await validate({ username, email, password }, [
    () => ({
      error: !username,
      status: 400,
      message: 'Username is required',
    }),
    () => ({
      error: !email,
      status: 400,
      message: 'Email is required',
    }),
    () => ({
      error: !password,
      status: 400,
      message: 'Password is required',
    }),
    async () => {
      const user = await User.findOne({ username })
      return {
        error: Boolean(user),
        status: 422,
        message: 'Username already exists',
      }
    },
    async () => {
      const user = await User.findOne({ email })
      return {
        error: Boolean(user),
        status: 422,
        message: 'Email already exists',
      }
    },
  ])

  return { error, status, message }
}

async function ableToSignInProcess({ username, password }: Omit<UserValidationType, 'user'>) {
  const { error, status, message } = await validate(null, [
    () => ({
      error: !username,
      status: 400,
      message: 'Username is required',
    }),
    () => ({
      error: !password,
      status: 400,
      message: 'Passoword is required',
    }),
  ])

  return { error, status, message }
}

async function ableToSignIn({ username, password, user }: UserValidationType) {
  const { error, status, message } = await validate({ username, password }, [
    () => ({
      error: !user,
      status: 422,
      message: 'Invalid data',
    }),
    async () => {
      const passwordMatch = await compare(password, user?.password!)

      return {
        error: !passwordMatch,
        status: 422,
        message: 'Invalid data',
      }
    },
  ])

  return { error, status, message }
}

async function ableToRefreshAuthorization({ authRefreshToken, session }: SessionValidationType) {
  const { error, status, message } = await validate(authRefreshToken, [
    () => ({
      error: !session,
      status: 401,
      message: 'Unauthenticated',
    }),
    () => ({
      error: !authRefreshToken,
      status: 401,
      message: 'Unauthenticated',
    }),
    async () => {
      try {
        jwt.verify(authRefreshToken, uri.secret_access_key)

        return {
          error: false,
          status: 200,
          message: 'Ok',
        }
      } catch {
        const { userId }: any = jwt.decode(authRefreshToken)

        await Session.deleteMany({ userId })

        return {
          error: true,
          status: 403,
          message: 'Invalid access token',
        }
      }
    },
  ])

  return { error, status, message }
}

function ableToShow(userId?: string) {
  return {
    error: !userId,
    status: 400,
    message: 'userId is required',
  }
}

export function createAccountValidator() {
  return {
    ableToCreate,
    ableToSignIn,
    ableToSignInProcess,
    ableToShow,
    ableToRefreshAuthorization,
  }
}
