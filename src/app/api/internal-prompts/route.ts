import { db } from "@/db"
import { internalPrompts, internalPromptVersions } from "@/db/schema"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import type { PromptFields } from "@/types/api"

export const GET = async () => {
  try {
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  let body: Partial<PromptFields>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const { title, description, template, tags } = body

    if (!title || !description || !template || !tags) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const now = Date.now()
    const id = randomUUID()
    const versionId = randomUUID()

    db.transaction((tx) => {
      tx.insert(internalPrompts).values({
        id,
        currentVersion: 1,
        createdAt: now,
        updatedAt: now
      }).run()

      tx.insert(internalPromptVersions).values({
        id: versionId,
        internalPromptId: id,
        version: 1,
        title,
        description,
        template,
        tags: JSON.stringify(tags),
        publishedAt: now
      }).run()
    })

    return NextResponse.json(
      {
        id,
        currentVersion: 1,
        createdAt: now,
        updatedAt: now,
        title,
        description,
        template,
        tags,
        publishedAt: now
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
