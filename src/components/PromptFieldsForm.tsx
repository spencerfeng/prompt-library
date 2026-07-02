"use client"

import { TagInput } from "@/components/TagInput"

export type PromptFields = {
  title: string
  description: string
  template: string
  tags: string[]
}

type Props = {
  fields: PromptFields
  onChange: (fields: PromptFields) => void
  onSubmit: (e: React.SyntheticEvent) => void
  onCancel: () => void
  saving: boolean
  error: string
  submitLabel?: string
}

export const PromptFieldsForm = ({
  fields,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
  submitLabel = "Save Prompt"
}: Props) => {
  const set = (key: keyof PromptFields) => (value: PromptFields[typeof key]) =>
    onChange({ ...fields, [key]: value })

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          placeholder="Use {{variable}} for placeholders"
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Tags</label>
        <TagInput value={fields.tags} onChange={set("tags")} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
