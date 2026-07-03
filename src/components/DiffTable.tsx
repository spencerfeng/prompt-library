"use client"

import type { FieldStatus, Side } from "@/helper/diff"

export type FieldRow = {
  key: string
  label: string
  status: FieldStatus
  base: string
  upstream: string
  customer: string
}


type Props = {
  rows: FieldRow[]
  choices: Record<string, Side>
  onChoiceChange: (key: string, side: Side) => void
};

const StatusBadge = ({ status }: { status: FieldStatus }) => {
  switch (status) {
    case "unchanged":     return <span className="text-xs text-gray-400">No change</span>
    case "upstream-only": return <span className="text-xs text-green-600">Auto-accepted</span>
    case "customer-only": return <span className="text-xs text-blue-600">Kept as-is</span>
    case "conflict":      return <span className="text-xs font-medium text-red-600">Conflict</span>
  }
}

export const DiffTable = ({ rows, choices, onChoiceChange }: Props) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">Fields</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left w-28">Field</th>
              <th className="px-4 py-3 text-left">Base</th>
              <th className="px-4 py-3 text-left">Upstream</th>
              <th className="px-4 py-3 text-left">Yours</th>
              <th className="px-4 py-3 text-left w-36">Resolution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {rows.map((row) => (
              <tr key={row.key} className={row.status === "unchanged" ? "opacity-40" : ""}>
                <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                <td className="px-4 py-3 text-gray-400 max-w-[140px] truncate">{row.base}</td>
                <td className={`px-4 py-3 max-w-[140px] truncate ${
                  row.status === "upstream-only" || row.status === "conflict"
                    ? "font-medium text-gray-900" : "text-gray-400"
                }`}>{row.upstream}</td>
                <td className={`px-4 py-3 max-w-[140px] truncate ${
                  row.status === "customer-only" || row.status === "conflict"
                    ? "font-medium text-gray-900" : "text-gray-400"
                }`}>{row.customer}</td>
                <td className="px-4 py-3">
                  {row.status === "conflict" ? (
                    <div className="flex flex-col gap-1">
                      {(["upstream", "customer"] as Side[]).map((side) => (
                        <label key={side} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`field-${row.key}`}
                            checked={(choices[row.key] ?? "upstream") === side}
                            onChange={() => onChoiceChange(row.key, side)}
                            className="accent-purple-600"
                          />
                          <span className="text-xs text-gray-700">
                            {side === "upstream" ? "Upstream" : "Yours"}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <StatusBadge status={row.status} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
