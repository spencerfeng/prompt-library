import { openai } from "@ai-sdk/openai"
import { generateText, Output } from "ai"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  title: z.string(),
  description: z.string(),
  template: z.string(),
  tags: z.array(z.string())
})

export const POST = async (req: NextRequest) => {
  const { description } = await req.json()

  if (!description) {
    return NextResponse.json({ error: "Missing description" }, { status: 400 })
  }

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    output: Output.object({ schema }),
    prompt: `Generate a prompt library entry for: ${description}

Rules:
- The template must use {{variable_name}} syntax (double curly braces) for every dynamic value that the user will fill in at runtime. Never use [placeholder] or <placeholder> style.
- Never wrap {{variable_name}} tokens in quotes of any kind (no single quotes, no double quotes, no backticks).
- Choose short, snake_case variable names that clearly describe what the user should insert.
- The title should be concise (3-6 words).
- The description should be one sentence explaining what the prompt does.
- Tags should be lowercase single words relevant to the use case. Avoid using underscores or hyphens in a tag.`
  })

  return NextResponse.json(result.output)
}
