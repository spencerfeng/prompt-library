"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { extractVariables } from "@/helper/template"

type Props = {
  promptId: string
  template: string
}

export const RenderForm = ({ promptId, template }: Props) => {
  const router = useRouter()
  const variables = extractVariables(template)
  const [values, setValues] = useState<Record<string, string>>({})
  const [rendered, setRendered] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRender = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/prompts/${promptId}/render`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables: values })
      })
      if (!res.ok) throw new Error("Render failed")
      const data = await res.json()
      setRendered(data.rendered)
      router.refresh()
    } catch {
      setError("Failed to render prompt.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Render</h2>
      <form onSubmit={handleRender} className="space-y-4">
        {variables.length === 0 ? (
          <p className="text-sm text-gray-400">This template has no variables.</p>
        ) : (
          variables.map((v) => (
            <div key={v}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {v}
              </label>
              <input
                type="text"
                value={values[v] ?? ""}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [v]: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Rendering..." : "Render"}
        </button>
      </form>

      {rendered !== null && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Output</h3>
          <pre className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap">
            {rendered}
          </pre>
        </div>
      )}
    </div>
  )
}
