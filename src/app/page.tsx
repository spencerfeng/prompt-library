import { FormattedDate } from "@/components/FormattedDate"
import { PageHeader } from "@/components/PageHeader"
import { PromptCard } from "@/components/PromptCard"
import { SearchBar } from "@/components/SearchBar"
import { Suspense } from "react"

const fetchPrompts = async (q?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts`)
  if (q) url.searchParams.set("q", q)
  const res = await fetch(url.toString(), { cache: "no-store" })
  return res.json()
}

const HomePage = async ({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) => {
  const { q } = await searchParams
  const prompts = await fetchPrompts(q)

  return (
    <>
      <PageHeader title="Prompt Library">
        <div className="w-64">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </PageHeader>

      <main className="flex-1 px-8 py-6">
        {prompts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No prompts found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {prompts.map((prompt: { id: string; title: string; description: string; tags: string[]; renderCount: number; lastUsedAt: number | null }) => (
              <PromptCard
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                title={prompt.title}
                description={prompt.description}
                tags={prompt.tags}
                meta={`${prompt.renderCount} render${prompt.renderCount !== 1 ? "s" : ""}`}
                footer={prompt.lastUsedAt ? <><span>Last used </span><FormattedDate timestamp={prompt.lastUsedAt} /></> : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default HomePage
