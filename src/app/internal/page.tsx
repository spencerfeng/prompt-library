import Link from "next/link"
import { PageHeader } from "@/components/PageHeader"
import { FormattedDate } from "@/components/FormattedDate"
import { PromptCard } from "@/components/PromptCard"

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
              <PromptCard
                key={prompt.id}
                href={`/internal/${prompt.id}`}
                title={prompt.title}
                description={prompt.description}
                tags={prompt.tags}
                badge={`v${prompt.currentVersion}`}
                meta={<>Updated <FormattedDate timestamp={prompt.updatedAt} /></>}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default InternalLibraryPage
