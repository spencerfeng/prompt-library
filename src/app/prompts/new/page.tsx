"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AiPromptForm } from "@/components/AiPromptForm"
import { BackLink } from "@/components/BackLink"
import { PageHeader } from "@/components/PageHeader"
import { PromptFieldsForm, PromptFields } from "@/components/PromptFieldsForm"

type Tab = "manual" | "ai"

const emptyFields: PromptFields = { title: "", description: "", template: "", tags: [] }

const NewPromptPage = () => {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("manual")
  const [fields, setFields] = useState<PromptFields>(emptyFields)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      })
      if (!res.ok) throw new Error("Save failed")
      const data = await res.json()
      router.push(`/prompts/${data.id}`)
    } catch {
      setError("Failed to save prompt. Please try again.")
      setSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Create Prompt" />

      <main className="flex-1 px-8 py-6">
        <BackLink href="/" label="Back to Library" />

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Prompt</h2>

        <div className="max-w-2xl">
          <div className="flex border-b border-gray-200 mb-6">
            {(["manual", "ai"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "manual" ? "Manual" : "AI Assist"}
              </button>
            ))}
          </div>

          {tab === "manual" && (
            <PromptFieldsForm
              fields={fields}
              onChange={setFields}
              onSubmit={handleSubmit}
              saving={saving}
              error={error}
              onCancel={() => router.push("/")}
            />
          )}

          {tab === "ai" && (
            <AiPromptForm
              fields={fields}
              setFields={setFields}
              onSubmit={handleSubmit}
              saving={saving}
              saveError={error}
              onCancel={() => router.push("/")}
            />
          )}
        </div>
      </main>
    </>
  )
}

export default NewPromptPage
