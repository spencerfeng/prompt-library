"use client"

import type { MergeResult, Side } from "@/helper/diff"

type Props = {
  merge: MergeResult
  hunkChoices: Record<number, Side>
  onHunkChoiceChange: (index: number, side: Side) => void
};

export const TemplateMergeView = ({ merge, hunkChoices, onHunkChoiceChange }: Props) => {
  if (merge.ok) {
    return (
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Template</h2>
        <p className="text-xs text-green-600 mb-2">Auto-merged — no conflicts</p>
        <pre className="rounded-lg bg-gray-900 px-5 py-4 text-sm text-gray-100 whitespace-pre-wrap font-mono leading-relaxed">
          {merge.result}
        </pre>
      </div>
    )
  }

  const conflictCount = merge.hunks.filter((h) => h.type === "conflict").length

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">Template</h2>
      <p className="text-xs text-amber-600 mb-3">
        {conflictCount} conflict{conflictCount !== 1 ? "s" : ""} — pick a version for each
      </p>
      <div className="space-y-2">
        {merge.hunks.map((hunk, i) => {
          if (hunk.type === "merged") {
            return (
              <pre
                key={i}
                className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-400 font-mono whitespace-pre-wrap leading-relaxed"
              >
                {hunk.lines.join("\n")}
              </pre>
            )
          }

          const choice = hunkChoices[i] ?? "upstream"
          return (
            <div key={i} className="rounded-lg border-2 border-amber-200 overflow-hidden">
              <div className="bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700 border-b border-amber-200 uppercase tracking-wide">
                Conflict
              </div>
              {(["upstream", "customer"] as Side[]).map((side, si) => (
                <label
                  key={side}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    si > 0 ? "border-t border-gray-100" : ""
                  } ${choice === side ? "bg-purple-50" : "bg-white hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name={`hunk-${i}`}
                    checked={choice === side}
                    onChange={() => onHunkChoiceChange(i, side)}
                    className="mt-0.5 accent-purple-600 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-gray-500 mb-1">
                      {side === "upstream" ? "Upstream" : "Yours"}
                    </div>
                    <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                      {(side === "upstream" ? hunk.upstream : hunk.customer).join("\n")}
                    </pre>
                  </div>
                </label>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
