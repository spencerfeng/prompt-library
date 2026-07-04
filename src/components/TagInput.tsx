"use client"

import { useState, useEffect, useRef } from "react"

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  className?: string
  placeholder?: string
}

export const TagInput = ({
  value,
  onChange,
  className = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
  placeholder = "e.g. support, classification"
}: Props) => {
  const [inputValue, setInputValue] = useState(value.join(", "))
  const editing = useRef(false)

  useEffect(() => {
    if (!editing.current) {
      setInputValue(value.join(", "))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editing.current = true
    const raw = e.target.value
    setInputValue(raw)
    const tags = raw.split(",").map((t) => t.trim()).filter(Boolean)
    onChange(tags)
  }

  const handleBlur = () => {
    editing.current = false
    setInputValue(value.join(", "))
  }

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
    />
  )
}
