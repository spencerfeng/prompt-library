"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BackLink } from "@/components/BackLink"
import { PromptFieldsForm } from "@/components/PromptFieldsForm"
import type { Prompt, PromptFields } from "@/types/api"

export const EditPromptForm = ({ prompt }: { prompt: Prompt }) => {
  const router = useRouter()
  const [fields, setFields] = useState<PromptFields>({
    title: prompt.title,
    description: prompt.description,
    template: prompt.template,
    tags: prompt.tags
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      })
      if (!res.ok) throw new Error("Save failed")
      router.push(`/prompts/${prompt.id}`)
    } catch {
      setError("Failed to save prompt. Please try again.")
      setSaving(false)
    }
  }

  return (
    <main className="flex-1 px-8 py-6">
      <BackLink href={`/prompts/${prompt.id}`} label="Back to Prompt" />

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Prompt</h2>

      <div className="max-w-2xl">
        <PromptFieldsForm
          fields={fields}
          onChange={setFields}
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/prompts/${prompt.id}`)}
          saving={saving}
          error={error}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  )
}
