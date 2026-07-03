export type Version = {
  id: string
  version: number
  title: string
  description: string
  template: string
  tags: string[]
  publishedAt: number
}

export type InternalPrompt = {
  id: string
  currentVersion: number
  createdAt: number
  updatedAt: number
  currentContent: Version
  versions: Version[]
}
