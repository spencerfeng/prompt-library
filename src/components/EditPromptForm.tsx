"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PromptFieldsForm, PromptFields } from "@/components/PromptFieldsForm"

type Prompt = {
  id: string
  title: string
  description: string
  template: string
  tags: string[]
}

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
      <button
        type="button"
        onClick={() => router.push(`/prompts/${prompt.id}`)}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Prompt
      </button>

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
