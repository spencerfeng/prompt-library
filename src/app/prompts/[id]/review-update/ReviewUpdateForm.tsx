"use client"

import { DiffTable } from "@/components/DiffTable"
import type { FieldRow } from "@/components/DiffTable"
import { TemplateMergeView } from "@/components/TemplateMergeView"
import { FinalResultPanel } from "@/components/FinalResultPanel"
import type { EditableFields } from "@/components/FinalResultPanel"
import { diffField, mergeTemplate } from "@/helper/diff"
import type { MergeResult, Side } from "@/helper/diff"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"


type Snapshot = {
  version: number
  title: string
  description: string
  template: string
  tags: string[]
};

type Props = {
  promptId: string
  base: Snapshot
  upstream: Snapshot
  customer: { title: string; description: string; template: string; tags: string[] }
}

export const ReviewUpdateForm = ({ promptId, base, upstream, customer }: Props) => {
  const router = useRouter()
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState("")

  const fieldRows: FieldRow[] = useMemo(() => [
    {
      key: "title",
      label: "Title",
      status: diffField(base.title, upstream.title, customer.title),
      base: base.title,
      upstream: upstream.title,
      customer: customer.title
    },
    {
      key: "description",
      label: "Description",
      status: diffField(base.description, upstream.description, customer.description),
      base: base.description,
      upstream: upstream.description,
      customer: customer.description
    },
    {
      key: "tags",
      label: "Tags",
      status: diffField(JSON.stringify(base.tags), JSON.stringify(upstream.tags), JSON.stringify(customer.tags)),
      base: base.tags.join(", "),
      upstream: upstream.tags.join(", "),
      customer: customer.tags.join(", ")
    }
  ], [base, upstream, customer])

  const templateMerge: MergeResult = useMemo(
    () => mergeTemplate(base.template, upstream.template, customer.template),
    [base, upstream, customer]
  )

  const [fieldChoices, setFieldChoices] = useState<Record<string, Side>>(() =>
    Object.fromEntries(
      fieldRows.filter((r) => r.status === "conflict").map((r) => [r.key, "upstream" as Side])
    )
  )

  const [hunkChoices, setHunkChoices] = useState<Record<number, Side>>(() => {
    if (templateMerge.ok) return {}
    return Object.fromEntries(
      templateMerge.hunks.flatMap((h, i) => h.type === "conflict" ? [[i, "upstream" as Side]] : [])
    )
  })

  const mergedFields: EditableFields = useMemo(() => {
    const resolve = <T,>(key: string, upVal: T, custVal: T): T => {
      const status = fieldRows.find((r) => r.key === key)?.status ?? "unchanged"
      if (status === "upstream-only") return upVal
      if (status === "unchanged" || status === "customer-only") return custVal
      return (fieldChoices[key] ?? "upstream") === "upstream" ? upVal : custVal
    }

    const template = templateMerge.ok
      ? templateMerge.result
      : templateMerge.hunks
          .flatMap((hunk, i) =>
            hunk.type === "merged"
              ? hunk.lines
              : (hunkChoices[i] ?? "upstream") === "upstream" ? hunk.upstream : hunk.customer
          )
          .join("\n")

    return {
      title: resolve("title", upstream.title, customer.title),
      description: resolve("description", upstream.description, customer.description),
      tags: resolve("tags", upstream.tags, customer.tags),
      template
    }
  }, [fieldChoices, hunkChoices, fieldRows, templateMerge, upstream, customer])

  const [editableFields, setEditableFields] = useState<EditableFields>(mergedFields)

  useEffect(() => {
    setEditableFields(mergedFields)
  }, [mergedFields])

  const handleApply = async () => {
    setApplying(true)
    setError("")

    try {
      const res = await fetch(`/api/prompts/${promptId}/accept-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: editableFields })
      })
      if (!res.ok) throw new Error()
      router.push(`/prompts/${promptId}`)
    } catch {
      setError("Failed to apply update. Please try again.")
      setApplying(false)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Reviewing</span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 font-mono text-xs">v{base.version}</span>
        <span>→</span>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 font-mono text-xs text-purple-700">v{upstream.version}</span>
      </div>

      <DiffTable
        rows={fieldRows}
        choices={fieldChoices}
        onChoiceChange={(key, side) => setFieldChoices((prev) => ({ ...prev, [key]: side }))}
      />

      <TemplateMergeView
        merge={templateMerge}
        hunkChoices={hunkChoices}
        onHunkChoiceChange={(i, side) => setHunkChoices((prev) => ({ ...prev, [i]: side }))}
      />

      <hr className="border-gray-200" />

      <FinalResultPanel
        beforeTemplate={customer.template}
        fields={editableFields}
        onChange={setEditableFields}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleApply}
          disabled={applying}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {applying ? "Applying..." : "Apply Update"}
        </button>
        <button
          onClick={() => router.push(`/prompts/${promptId}`)}
          className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
