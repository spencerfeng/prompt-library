import { db } from "@/db"
import { prompts } from "@/db/schema"
import { randomUUID } from "crypto"
import { like, or } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")

    const rows = await db
      .select()
      .from(prompts)
      .where(
        q
          ? or(
              like(prompts.title, `%${q}%`),
              like(prompts.description, `%${q}%`),
              like(prompts.tags, `%${q}%`)
            )
          : undefined
      )

    return NextResponse.json(rows.map((p) => ({ ...p, tags: JSON.parse(p.tags) })))
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  let body: { title?: string; description?: string; template?: string; tags?: string[] }
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
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
