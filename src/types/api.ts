import type { internalPrompts, internalPromptVersions, prompts } from "@/db/schema"

export type PromptFields = {
  title: string
  description: string
  template: string
  tags: string[]
}

export type Prompt = Omit<typeof prompts.$inferSelect, "tags"> & {
  tags: string[]
}

export type InternalPromptVersion = Omit<
  typeof internalPromptVersions.$inferSelect,
  "tags"
> & { tags: string[] }

export type InternalPrompt = typeof internalPrompts.$inferSelect & {
  currentContent: InternalPromptVersion
  versions: InternalPromptVersion[]
}

export type InternalPromptListItem = typeof internalPrompts.$inferSelect &
  PromptFields & { publishedAt: number }
