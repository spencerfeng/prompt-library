import { db } from "@/db"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const prompt = await db.query.prompts.findFirst({
      where: { id }
    })

    if (!prompt) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    if (prompt.source !== "internal" || !prompt.internalPromptId || prompt.baseVersion === null) {
      return NextResponse.json({ hasUpdate: false })
    }

    const internal = await db.query.internalPrompts.findFirst({
      where: { id: prompt.internalPromptId }
    })

    if (!internal) {
      return NextResponse.json({ hasUpdate: false })
    }

    const hasUpdate = internal.currentVersion > prompt.baseVersion

    if (!hasUpdate) {
      return NextResponse.json({ hasUpdate: false })
    }

    const [base, upstream] = await Promise.all([
      db.query.internalPromptVersions.findFirst({
        where: { internalPromptId: prompt.internalPromptId, version: prompt.baseVersion }
      }),
      db.query.internalPromptVersions.findFirst({
        where: { internalPromptId: prompt.internalPromptId, version: internal.currentVersion }
      })
    ])

    return NextResponse.json({
      hasUpdate: true,
      base: base ? { ...base, tags: JSON.parse(base.tags) } : null,
      upstream: upstream ? { ...upstream, tags: JSON.parse(upstream.tags) } : null,
      customer: { ...prompt, tags: JSON.parse(prompt.tags) }
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
