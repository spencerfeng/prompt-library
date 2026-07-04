"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PromptFieldsForm } from "@/components/PromptFieldsForm"
import type { PromptFields } from "@/types/api"

type Props = {
  internalId: string
  currentContent: PromptFields
  onClose: () => void
}

export const PublishAction = ({ internalId, currentContent, onClose }: Props) => {
  const router = useRouter()
  const [fields, setFields] = useState<PromptFields>(currentContent)
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")

  const handlePublish = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setPublishing(true)
    setError("")
    try {
      const res = await fetch(`/api/internal-prompts/${internalId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      })
      if (!res.ok) throw new Error()
      router.refresh()
      onClose()
    } catch {
      setError("Failed to publish. Please try again.")
      setPublishing(false)
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Publish New Version</h3>
      <PromptFieldsForm
        fields={fields}
        onChange={setFields}
        onSubmit={handlePublish}
        onCancel={onClose}
        saving={publishing}
        error={error}
        submitLabel="Publish"
      />
    </div>
  )
}
