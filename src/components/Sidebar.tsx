"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

const navItems = [
  { label: "Library", href: "/" },
  { label: "Create Prompt", href: "/prompts/new" },
  { label: "Internal Library", href: "/internal" }
]

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState<"seed" | "reset" | null>(null)

  const handleSeed = async () => {
    setLoading("seed")
    await fetch("/api/dev/seed", { method: "POST" })
    setLoading(null)
    router.push("/")
  }

  const handleReset = async () => {
    setLoading("reset")
    await fetch("/api/dev/reset", { method: "DELETE" })
    setLoading(null)
    router.push("/")
  }

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 min-h-screen flex flex-col bg-white">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ label, href }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm ${
                active
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto p-3 flex flex-col gap-2 border-t border-gray-200">
        <button
          onClick={handleSeed}
          disabled={loading !== null}
          className="w-full rounded-lg px-3 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "seed" ? "Populating..." : "Populate Mock Data"}
        </button>
        <button
          onClick={handleReset}
          disabled={loading !== null}
          className="w-full rounded-lg px-3 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === "reset" ? "Resetting..." : "Reset Data"}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
