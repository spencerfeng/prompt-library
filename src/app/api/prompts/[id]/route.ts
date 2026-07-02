import { db } from "@/db"
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
