export interface INoteSchema {
  id: string
  type: 'note' | 'marker'
  groupId: string
  imageUrl?: string
  description: string
  creatorId: string
  createdAt: string
  updatedAt: string
  checked?: boolean
}

export interface INoteGroupSchema {
  id: string
  creatorId: string
  name: string
  createdAt: string
  updatedAt: string
}
