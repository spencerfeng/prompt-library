"use client"

type Props = {
  beforeTemplate: string
  afterTemplate: string
}

export const TemplatePreviewPanel = ({ beforeTemplate, afterTemplate }: Props) => {
  const unchanged = beforeTemplate === afterTemplate

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">Live Preview</h2>

      {unchanged && (
        <p className="text-xs text-gray-400 mb-3">Template is unchanged — before and after are identical.</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
            Before
          </div>
          <pre className="rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed min-h-[100px]">
            {beforeTemplate}
          </pre>
        </div>
        <div>
          <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">
            After
          </div>
          <pre className="rounded-lg bg-gray-900 px-4 py-3 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed min-h-[100px]">
            {afterTemplate}
          </pre>
        </div>
      </div>
    </div>
  )
}
