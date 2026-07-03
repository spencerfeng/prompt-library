import { db } from "@/db"
import { internalPrompts, internalPromptVersions, prompts } from "@/db/schema"
import { randomUUID } from "crypto"
import { NextResponse } from "next/server"

const userPromptSeeds = [
  {
    title: "Email Reply Draft",
    description: "Draft a professional reply to an email thread.",
    template: "You are a professional email writer.\n\nOriginal email:\n{{email}}\n\nDraft a clear, polite, and concise reply.",
    tags: ["email", "writing", "professional"]
  },
  {
    title: "Code Review Summary",
    description: "Summarise code review feedback into actionable items.",
    template: "You are a senior engineer summarising a code review.\n\nReview comments:\n{{comments}}\n\nList the key action items grouped by priority (high / medium / low).",
    tags: ["code", "review", "engineering"]
  },
  {
    title: "Meeting Notes Formatter",
    description: "Convert raw meeting notes into structured action items.",
    template: "Format the following raw meeting notes into:\n- Summary (2–3 sentences)\n- Action items (owner + due date where mentioned)\n\nNotes:\n{{notes}}",
    tags: ["meetings", "productivity"]
  },
  {
    title: "Bug Report Template",
    description: "Generate a structured bug report from a freeform description.",
    template: "Convert the following description into a structured bug report with: Title, Steps to Reproduce, Expected Behaviour, Actual Behaviour, and Severity.\n\nDescription:\n{{description}}",
    tags: ["bugs", "engineering", "qa"]
  }
]

const internalPromptSeeds = [
  {
    title: "Customer Support Response",
    description: "Internal template for responding to customer support tickets.",
    template: "You are a helpful customer support agent for our product.\n\nCustomer issue:\n{{issue}}\n\nWrite a friendly, solution-focused response. If escalation is needed, say so clearly.",
    tags: ["support", "customer", "internal"]
  },
  {
    title: "Release Notes Generator",
    description: "Generate user-facing release notes from a list of commit messages.",
    template: "You are a technical writer generating release notes.\n\nCommits:\n{{commits}}\n\nWrite concise, user-facing release notes grouped into: New Features, Improvements, Bug Fixes. Skip internal or chore commits.",
    tags: ["releases", "docs", "internal"]
  }
]

export const POST = async () => {
  try {
    const now = Date.now()

    for (const seed of userPromptSeeds) {
      await db.insert(prompts).values({
        id: randomUUID(),
        title: seed.title,
        description: seed.description,
        template: seed.template,
        tags: JSON.stringify(seed.tags),
        source: "user",
        createdAt: now,
        updatedAt: now
      })
    }

    for (const seed of internalPromptSeeds) {
      const id = randomUUID()
      const versionId = randomUUID()

      db.transaction((tx) => {
        tx.insert(internalPrompts).values({
          id,
          currentVersion: 1,
          createdAt: now,
          updatedAt: now
        }).run()

        tx.insert(internalPromptVersions).values({
          id: versionId,
          internalPromptId: id,
          version: 1,
          title: seed.title,
          description: seed.description,
          template: seed.template,
          tags: JSON.stringify(seed.tags),
          publishedAt: now
        }).run()
      })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
