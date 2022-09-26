export interface IUserSchema {
  id: string
  avatar?: string
  username: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface ISessionSchema {
  id: string
  userId: string
  refreshToken: string
}
