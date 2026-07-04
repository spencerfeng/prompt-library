import { db } from "@/db"
import { eq } from "drizzle-orm"
import { prompts } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"
import type { PromptFields } from "@/types/api"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    const prompt = await db.query.prompts.findFirst({ where: { id } })

    if (!prompt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ ...prompt, tags: JSON.parse(prompt.tags) })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const PUT = async (
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

    const [updated] = await db
      .update(prompts)
      .set({ title, description, template, tags: JSON.stringify(tags), updatedAt: Date.now() })
      .where(eq(prompts.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ ...updated, tags: JSON.parse(updated.tags) })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
