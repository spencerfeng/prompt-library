import { notFound } from "next/navigation"
import { db } from "@/db"
import { InternalPromptActions } from "./InternalPromptActions"
import { VersionHistory } from "./VersionHistory"
import { PageHeader } from "@/components/PageHeader"
import { BackLink } from "@/components/BackLink"

const InternalPromptDetailPage = async ({
  params
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const internal = await db.query.internalPrompts.findFirst({
    where: { id },
    with: { versions: true, prompts: true }
  })

  if (!internal) notFound()

  const currentVersionData = internal.versions.find((v) => v.version === internal.currentVersion)
  if (!currentVersionData) notFound()

  const currentContent = {
    ...currentVersionData,
    tags: JSON.parse(currentVersionData.tags) as string[]
  }

  const versions = internal.versions
    .map((v) => ({ ...v, tags: JSON.parse(v.tags) as string[] }))
    .sort((a, b) => b.version - a.version)

  const forkedPromptId = internal.prompts[0]?.id ?? null

  return (
    <>
      <PageHeader title={currentContent.title}>
        <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
          v{internal.currentVersion}
        </span>
      </PageHeader>

      <main className="flex-1 px-8 py-6 space-y-8">
        <BackLink href="/internal" label="Back to Internal Library" />

        <div className="space-y-4">
          <p className="text-sm text-gray-500">{currentContent.description}</p>

          <div className="flex flex-wrap gap-2">
            {currentContent.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Prompt Template</h3>
            <pre className="rounded-lg bg-gray-900 px-5 py-4 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
              {currentContent.template}
            </pre>
          </div>
        </div>

        <InternalPromptActions
          internalId={id}
          currentContent={{
            title: currentContent.title,
            description: currentContent.description,
            template: currentContent.template,
            tags: currentContent.tags
          }}
          forkedPromptId={forkedPromptId}
        />

        <VersionHistory versions={versions} currentVersion={internal.currentVersion} />
      </main>
    </>
  )
}

export default InternalPromptDetailPage
