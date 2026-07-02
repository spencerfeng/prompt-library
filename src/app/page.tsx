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
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q } = await searchParams
  const prompts = await fetchPrompts(q)

  return (
    <>
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Prompt Library</h1>
        <div className="w-64">
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </header>

      <main className="flex-1 px-8 py-6">
        {prompts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No prompts found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {prompts.map((prompt: Parameters<typeof PromptCard>[0]["prompt"]) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default HomePage
