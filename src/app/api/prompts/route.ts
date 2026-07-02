import { db } from "@/db"
import { prompts } from "@/db/schema"
import { randomUUID } from "crypto"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, description, template, tags } = body

  if (!title || !description || !template || !tags) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const now = Date.now()
  const id = randomUUID()

  const [prompt] = await db
    .insert(prompts)
    .values({
      id,
      title,
      description,
      template,
      tags: JSON.stringify(tags),
      source: "user",
      createdAt: now,
      updatedAt: now
    })
    .returning()

  return NextResponse.json({ ...prompt, tags: JSON.parse(prompt.tags) }, { status: 201 })
}
