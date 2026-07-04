"use client"

import { useState } from "react"
import type { PromptFields } from "@/types/api"
import { ForkAction } from "./ForkAction"
import { PublishAction } from "./PublishAction"

type Props = {
  internalId: string
  currentContent: PromptFields
  forkedPromptId: string | null
}

export const InternalPromptActions = ({ internalId, currentContent, forkedPromptId }: Props) => {
  const [showPublishForm, setShowPublishForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ForkAction internalId={internalId} forkedPromptId={forkedPromptId} />
        <button
          onClick={() => setShowPublishForm((v) => !v)}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {showPublishForm ? "Cancel" : "Publish New Version"}
        </button>
      </div>

      {showPublishForm && (
        <PublishAction
          internalId={internalId}
          currentContent={currentContent}
          onClose={() => setShowPublishForm(false)}
        />
      )}
    </div>
  )
}
