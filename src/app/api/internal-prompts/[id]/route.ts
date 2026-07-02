import { db } from "@/db"
import { internalPromptVersions } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  const internal = await db.query.internalPrompts.findFirst({
    where: { id }
  })

  if (!internal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const versions = await db
    .select()
    .from(internalPromptVersions)
    .where(eq(internalPromptVersions.internalPromptId, id))
    .orderBy(desc(internalPromptVersions.version))

  const currentContent = versions.find((v) => v.version === internal.currentVersion)

  if (!currentContent) {
    return NextResponse.json({ error: "Current version content missing" }, { status: 500 })
  }

  return NextResponse.json({
    id: internal.id,
    currentVersion: internal.currentVersion,
    createdAt: internal.createdAt,
    updatedAt: internal.updatedAt,
    currentContent: { ...currentContent, tags: JSON.parse(currentContent.tags) },
    versions: versions.map((v) => ({ ...v, tags: JSON.parse(v.tags) }))
  })
}
