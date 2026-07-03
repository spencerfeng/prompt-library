import { FormattedDate } from "@/components/FormattedDate"
import { Version } from "./types"

type Props = {
  versions: Version[]
  currentVersion: number
}

export const VersionHistory = ({ versions, currentVersion }: Props) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-gray-900 mb-3">Version History</h2>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Version</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-left">Published</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {versions.map((v) => (
              <tr key={v.id} className={v.version === currentVersion ? "bg-purple-50" : ""}>
                <td className="px-4 py-3 font-medium text-gray-900">
                  v{v.version}
                  {v.version === currentVersion && (
                    <span className="ml-2 text-xs text-purple-600">current</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{v.title}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {v.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  <FormattedDate timestamp={v.publishedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
