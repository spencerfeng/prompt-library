import { db } from "@/db"
import { internalPrompts, internalPromptVersions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import type { PromptFields } from "@/types/api"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  let body: Partial<PromptFields>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const { id } = await params
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
