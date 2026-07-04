"use client"

import { useEffect, useRef } from "react"
import { TagInput } from "@/components/TagInput"

export type EditableFields = {
  title: string
  description: string
  tags: string[]
  template: string
}

type Props = {
  beforeTemplate: string
  fields: EditableFields
  onChange: (fields: EditableFields) => void
}

export const FinalResultPanel = ({ beforeTemplate, fields, onChange }: Props) => {
  const update = (patch: Partial<EditableFields>) => onChange({ ...fields, ...patch })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [fields.template])

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Edit Final Result</h2>
      <p className="text-xs text-gray-500 mb-5">Fine-tune the merged result before applying. Changes here won't affect the conflict selections above.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1">Title</label>
          <input
            type="text"
            value={fields.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1">Description</label>
          <textarea
            value={fields.description}
            onChange={(e) => update({ description: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-1">Tags (comma-separated)</label>
          <TagInput
            value={fields.tags}
            onChange={(tags) => update({ tags })}
            placeholder=""
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-900 mb-3">Template</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[11px] text-gray-500 mb-2">Before</div>
              <pre className="rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed min-h-[120px]">
                {beforeTemplate}
              </pre>
            </div>
            <div>
              <div className="text-[11px] text-gray-500 mb-2">After</div>
              <textarea
                ref={textareaRef}
                value={fields.template}
                onChange={(e) => update({ template: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-mono leading-relaxed min-h-[120px] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
