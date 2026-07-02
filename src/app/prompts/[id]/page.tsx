import Link from "next/link"
import { notFound } from "next/navigation"
import { RenderForm } from "@/components/RenderForm"

const fetchPrompt = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/prompts/${id}`,
    { cache: "no-store" }
  )
  if (res.status === 404) return null
  return res.json()
}

const PromptDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const prompt = await fetchPrompt(id)

  if (!prompt) notFound()

  return (
    <>
      <header className="flex items-center justify-between px-8 h-16 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{prompt.title}</h1>
      </header>

      <main className="flex-1 px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Library
        </Link>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{prompt.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{prompt.description}</p>
            </div>
            <Link
              href={`/prompts/${id}/edit`}
              className="shrink-0 flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Prompt Template</h3>
            <pre className="rounded-lg bg-gray-900 px-5 py-4 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
              {prompt.template}
            </pre>
          </div>

          <div className="flex gap-6 text-xs text-gray-400">
            <span>{prompt.renderCount} render{prompt.renderCount !== 1 ? "s" : ""}</span>
            {prompt.lastUsedAt && (
              <span>Last used {new Date(prompt.lastUsedAt).toLocaleDateString()}</span>
            )}
          </div>

          <RenderForm promptId={id} template={prompt.template} />
        </div>
      </main>
    </>
  )
}

export default PromptDetailPage
