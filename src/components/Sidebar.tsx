"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { label: "Library", href: "/" },
  { label: "Create Prompt", href: "/prompts/new" },
  { label: "Internal Library", href: "/internal" }
]

const Sidebar = () => {
  const pathname = usePathname()

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
    </aside>
  )
}

export default Sidebar
