import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const prompts = sqliteTable("prompts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(),
  tags: text("tags").notNull(),
  renderCount: integer("render_count").notNull().default(0),
  lastUsedAt: integer("last_used_at"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  source: text("source").notNull().default("user"),
  internalPromptId: text("internal_prompt_id").references(
    () => internalPrompts.id
  ),
  baseVersion: integer("base_version")
})

export const internalPrompts = sqliteTable("internal_prompts", {
  id: text("id").primaryKey(),
  currentVersion: integer("current_version").notNull().default(1),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
})

export const internalPromptVersions = sqliteTable("internal_prompt_versions", {
  id: text("id").primaryKey(),
  internalPromptId: text("internal_prompt_id")
    .notNull()
    .references(() => internalPrompts.id),
  version: integer("version").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  template: text("template").notNull(),
  tags: text("tags").notNull(),
  publishedAt: integer("published_at").notNull()
})
