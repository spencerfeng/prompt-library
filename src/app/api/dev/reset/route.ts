import { db } from "@/db"
import { internalPromptVersions, internalPrompts, prompts } from "@/db/schema"
import { NextResponse } from "next/server"

export const DELETE = async () => {
  try {
    await db.delete(internalPromptVersions)
    await db.delete(prompts)
    await db.delete(internalPrompts)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
