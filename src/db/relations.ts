import { defineRelations } from "drizzle-orm"
import * as schema from "./schema"

export const relations = defineRelations(schema, (helpers) => ({
  prompts: {
    internalPrompt: helpers.one.internalPrompts({
      from: helpers.prompts.internalPromptId,
      to: helpers.internalPrompts.id,
      optional: true
    })
  },
  internalPrompts: {
    prompts: helpers.many.prompts(),
    versions: helpers.many.internalPromptVersions()
  },
  internalPromptVersions: {
    internalPrompt: helpers.one.internalPrompts({
      from: helpers.internalPromptVersions.internalPromptId,
      to: helpers.internalPrompts.id
    })
  }
}))
