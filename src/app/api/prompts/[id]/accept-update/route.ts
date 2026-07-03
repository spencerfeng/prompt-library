import { db } from "@/db"
import { prompts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await req.json()
  const { fields } = body as { fields: { title: string; description: string; template: string; tags: string[] } }

  if (!fields?.title || !fields?.description || !fields?.template || !fields?.tags) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const prompt = await db.query.prompts.findFirst({
    where: { id }
  })

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (prompt.source !== "internal" || !prompt.internalPromptId) {
    return NextResponse.json({ error: "Prompt is not linked to an internal prompt" }, { status: 400 })
  }

  const internal = await db.query.internalPrompts.findFirst({
    where: { id: prompt.internalPromptId }
  })

  if (!internal) {
    return NextResponse.json({ error: "Internal prompt not found" }, { status: 404 })
  }

  const [updated] = await db
    .update(prompts)
    .set({
      title: fields.title,
      description: fields.description,
      template: fields.template,
      tags: JSON.stringify(fields.tags),
      baseVersion: internal.currentVersion,
      updatedAt: Date.now()
    })
    .where(eq(prompts.id, id))
    .returning()

  return NextResponse.json({ ...updated, tags: JSON.parse(updated.tags) })
}
