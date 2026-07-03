import { db } from "@/db"
import { prompts } from "@/db/schema"
import { renderTemplate } from "@/helper/template"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  let body: { variables?: Record<string, string> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const { id } = await params
    const { variables } = body

    const prompt = await db.query.prompts.findFirst({ where: { id } })

    if (!prompt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const rendered = renderTemplate(prompt.template, variables ?? {})

    await db
      .update(prompts)
      .set({
        renderCount: sql`${prompts.renderCount} + 1`,
        lastUsedAt: Date.now()
      })
      .where(eq(prompts.id, id))

    return NextResponse.json({ rendered })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
