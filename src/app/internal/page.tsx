import { PageHeader } from "@/components/PageHeader"
import Link from "next/link"

type InternalPrompt = {
  id: string
  currentVersion: number
  title: string
  description: string
  tags: string[]
  updatedAt: number
}

const fetchInternalPrompts = async (): Promise<InternalPrompt[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/internal-prompts`, {
    cache: "no-store"
  })
  return res.json()
}

const InternalLibraryPage = async () => {
  const prompts = await fetchInternalPrompts()

  return (
    <>
      <PageHeader title="Internal Library">
        <Link
          href="/internal/new"
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          New Internal Prompt
        </Link>
      </PageHeader>

      <main className="flex-1 px-8 py-6">
        {prompts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No internal prompts yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/internal/${prompt.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-purple-400"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900 truncate">{prompt.title}</h2>
                    <span className="shrink-0 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                      v{prompt.currentVersion}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 truncate">{prompt.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-4 shrink-0 text-xs text-gray-400">
                  Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default InternalLibraryPage
