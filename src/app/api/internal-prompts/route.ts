import { db } from "@/db"
import { internalPrompts, internalPromptVersions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const rows = await db
    .select({
      id: internalPrompts.id,
      currentVersion: internalPrompts.currentVersion,
      createdAt: internalPrompts.createdAt,
      updatedAt: internalPrompts.updatedAt,
      title: internalPromptVersions.title,
      description: internalPromptVersions.description,
      template: internalPromptVersions.template,
      tags: internalPromptVersions.tags,
      publishedAt: internalPromptVersions.publishedAt
    })
    .from(internalPrompts)
    .innerJoin(
      internalPromptVersions,
      eq(internalPromptVersions.internalPromptId, internalPrompts.id)
    )
    .where(eq(internalPromptVersions.version, internalPrompts.currentVersion))

  return NextResponse.json(rows.map((r) => ({ ...r, tags: JSON.parse(r.tags) })))
}
