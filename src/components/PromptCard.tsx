import Link from "next/link"

type Props = {
  href: string
  title: string
  description: string
  tags: string[]
  badge?: React.ReactNode
  meta?: React.ReactNode
  footer?: React.ReactNode
}

export const PromptCard = ({ href, title, description, tags, badge, meta, footer }: Props) => (
  <Link
    href={href}
    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 hover:border-purple-400"
  >
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold text-gray-900 truncate">{title}</h2>
        {badge && (
          <span className="shrink-0 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-0.5 text-sm text-gray-500 truncate">{description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {tag}
          </span>
        ))}
      </div>
      {footer && <p className="mt-2 text-xs text-gray-400">{footer}</p>}
    </div>
    {meta && <span className="ml-4 shrink-0 text-xs text-gray-400">{meta}</span>}
  </Link>
)
