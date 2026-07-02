import { db } from "@/db"
import { internalPrompts, internalPromptVersions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await req.json()
  const { title, description, template, tags } = body

  if (!title || !description || !template || !tags) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const internal = await db.query.internalPrompts.findFirst({
    where: { id }
  })

  if (!internal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const newVersion = internal.currentVersion + 1
  const now = Date.now()

  db.transaction((tx) => {
    tx.update(internalPrompts)
      .set({ currentVersion: newVersion, updatedAt: now })
      .where(eq(internalPrompts.id, id))
      .run()

    tx.insert(internalPromptVersions)
      .values({
        id: randomUUID(),
        internalPromptId: id,
        version: newVersion,
        title,
        description,
        template,
        tags: JSON.stringify(tags),
        publishedAt: now
      })
      .run()
  })

  return NextResponse.json({
    id,
    currentVersion: newVersion,
    createdAt: internal.createdAt,
    updatedAt: now,
    currentContent: { title, description, template, tags, version: newVersion, publishedAt: now }
  })
}
