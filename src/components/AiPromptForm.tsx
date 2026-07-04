"use client"

import { useState } from "react"
import { TagInput } from "@/components/TagInput"
import type { PromptFields } from "@/types/api"

type Props = {
  fields: PromptFields
  setFields: React.Dispatch<React.SetStateAction<PromptFields>>
  onSubmit: (e: React.SyntheticEvent) => void
  saving: boolean
  saveError: string
  onCancel: () => void
}

export const AiPromptForm = ({ fields, setFields, onSubmit, saving, saveError, onCancel }: Props) => {
  const [aiDescription, setAiDescription] = useState("")
  const [loadingAi, setLoadingAi] = useState(false)
  const [aiGenerated, setAiGenerated] = useState(false)
  const [generateError, setGenerateError] = useState("")

  const set = (key: keyof PromptFields) => (value: PromptFields[typeof key]) =>
    setFields((f) => ({ ...f, [key]: value }))

  async function handleGenerate() {
    if (!aiDescription.trim()) return
    setLoadingAi(true)
    setGenerateError("")
    try {
      const res = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: aiDescription })
      })
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      setFields(data)
      setAiGenerated(true)
    } catch {
      setGenerateError("Failed to generate prompt. Please try again.")
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">
          Describe what you need
        </label>
        <textarea
          value={aiDescription}
          onChange={(e) => setAiDescription(e.target.value)}
          rows={3}
          placeholder="e.g. A prompt that classifies customer support tickets by urgency"
          disabled={loadingAi}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loadingAi || !aiDescription.trim()}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {loadingAi ? "Generating..." : aiGenerated ? "Regenerate" : "Generate"}
        </button>
      </div>

      {!aiGenerated && generateError && <p className="text-sm text-red-600">{generateError}</p>}

      {aiGenerated && (
        <>
          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
              <input
                type="text"
                value={fields.title}
                onChange={(e) => set("title")(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea
                value={fields.description}
                onChange={(e) => set("description")(e.target.value)}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-900">Prompt Template</label>
                <span className="text-xs text-gray-400">Use {"{{"} {"}}"} for dynamic values</span>
              </div>
              <textarea
                value={fields.template}
                onChange={(e) => set("template")(e.target.value)}
                required
                rows={8}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
              <TagInput value={fields.tags} onChange={set("tags")} />
            </div>
          </div>

          {saveError && <p className="text-sm text-red-600">{saveError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Prompt"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </form>
  )
}
