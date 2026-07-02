"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { AiPromptForm } from "@/components/AiPromptForm"
import { ManualPromptForm } from "@/components/ManualPromptForm"
import { FormFields } from "@/components/types"

type Tab = "manual" | "ai"

const emptyFields: FormFields = { title: "", description: "", template: "", tags: [] }

const NewPromptPage = () => {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("manual")
  const [fields, setFields] = useState<FormFields>(emptyFields)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.SyntheticEvent) {
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
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Create Prompt</h1>
      </header>

      <main className="flex-1 px-8 py-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Library
        </button>

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
            <ManualPromptForm
              fields={fields}
              setFields={setFields}
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
