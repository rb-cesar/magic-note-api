export interface IUserSchema {
  id: string
  username: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface ISession {
  id: string
  userId: string
  refreshToken: string
}
