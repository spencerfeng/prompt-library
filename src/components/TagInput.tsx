"use client"

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
}

export const TagInput = ({ value, onChange }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    onChange(tags)
  }

  return (
    <input
      type="text"
      value={value.join(", ")}
      onChange={handleChange}
      placeholder="e.g. support, classification"
      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
