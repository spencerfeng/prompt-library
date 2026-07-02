import Link from "next/link"

type Prompt = {
  id: string
  title: string
  description: string
  tags: string[]
  renderCount: number
  lastUsedAt: number | null
}

export const PromptCard = ({ prompt }: {prompt: Prompt}) => {
  return (
    <Link
      href={`/prompts/${prompt.id}`}
      className="block rounded-lg border border-gray-200 p-4 hover:border-blue-400"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold text-gray-900">{prompt.title}</h2>
        <span className="text-xs text-gray-400">
          {prompt.renderCount} render{prompt.renderCount !== 1 ? "s" : ""}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{prompt.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
      {prompt.lastUsedAt && (
        <p className="mt-2 text-xs text-gray-400">
          Last used {new Date(prompt.lastUsedAt).toLocaleDateString()}
        </p>
      )}
    </Link>
  )
}
