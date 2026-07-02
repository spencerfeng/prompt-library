import { db } from "@/db"
import { eq } from "drizzle-orm"
import { prompts } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const prompt = await db.query.prompts.findFirst({ where: { id } })

  if (!prompt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ...prompt, tags: JSON.parse(prompt.tags) })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
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
}
