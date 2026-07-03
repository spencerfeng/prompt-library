"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PromptFieldsForm, PromptFields, emptyFields } from "@/components/PromptFieldsForm"
import { PageHeader } from "@/components/PageHeader"
import { BackLink } from "@/components/BackLink"

const NewInternalPromptPage = () => {
  const router = useRouter()
  const [fields, setFields] = useState<PromptFields>(emptyFields)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/internal-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      })
      if (!res.ok) throw new Error("Save failed")
      const data = await res.json()
      router.push(`/internal/${data.id}`)
    } catch {
      setError("Failed to save. Please try again.")
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="New Internal Prompt" />

      <main className="flex-1 px-8 py-6">
        <BackLink href="/internal" label="Back to Internal Library" />

        <div className="max-w-2xl">
          <PromptFieldsForm
            fields={fields}
            onChange={setFields}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/internal")}
            saving={saving}
            error={error}
          />
        </div>
      </main>
    </>
  )
}

export default NewInternalPromptPage
