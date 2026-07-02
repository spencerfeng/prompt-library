"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [value, setValue] = useState(searchParams.get("q") ?? "")

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (value) {
        params.set("q", value)
      }

      router.replace(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [router, value])

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search prompts..."
      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
