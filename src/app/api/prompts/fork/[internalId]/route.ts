import { db } from "@/db"
import { prompts } from "@/db/schema"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (
  _req: NextRequest,
  { params }: { params: Promise<{ internalId: string }> }
) => {
  const { internalId } = await params

  const internal = await db.query.internalPrompts.findFirst({
    where: { id: internalId }
  })

  if (!internal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const currentContent = await db.query.internalPromptVersions.findFirst({
    where: { internalPromptId: internalId, version: internal.currentVersion }
  })

  if (!currentContent) {
    return NextResponse.json({ error: "Current version content missing" }, { status: 500 })
  }

  const now = Date.now()
  const id = randomUUID()

  const [prompt] = await db
    .insert(prompts)
    .values({
      id,
      title: currentContent.title,
      description: currentContent.description,
      template: currentContent.template,
      tags: currentContent.tags,
      source: "internal",
      internalPromptId: internalId,
      baseVersion: internal.currentVersion,
      createdAt: now,
      updatedAt: now
    })
    .returning()

  return NextResponse.json({ ...prompt, tags: JSON.parse(prompt.tags) }, { status: 201 })
}
