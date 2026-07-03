"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  internalId: string
  forkedPromptId: string | null
}

export const ForkAction = ({ internalId, forkedPromptId }: Props) => {
  const router = useRouter()
  const [forking, setForking] = useState(false)
  const [error, setError] = useState("")

  const handleFork = async () => {
    setForking(true)
    setError("")

    try {
      const res = await fetch(`/api/prompts/fork/${internalId}`, { method: "POST" })
      if (!res.ok) throw new Error()
      const data = await res.json()
      router.push(`/prompts/${data.id}`)
    } catch {
      setError("Failed to fork. Please try again.")
      setForking(false)
    }
  }

  return (
    <>
      {forkedPromptId ? (
        <Link
          href={`/prompts/${forkedPromptId}`}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
        >
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Already in your library
        </Link>
      ) : (
        <button
          onClick={handleFork}
          disabled={forking}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
        >
          {forking ? "Forking..." : "Fork to my library"}
        </button>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </>
  )
}
