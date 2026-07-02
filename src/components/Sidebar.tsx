import Link from "next/link"

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 min-h-screen flex flex-col bg-white">
      <nav className="flex flex-col gap-1 p-3">
        <Link
          href="/"
          className="flex items-center px-3 py-2 rounded-lg bg-purple-50 text-purple-700 font-medium text-sm"
        >
          Library
        </Link>
      </nav>
    </aside>
  )
}
