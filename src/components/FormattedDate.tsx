"use client"

type Props = {
  timestamp: number
}

export const FormattedDate = ({ timestamp }: Props) => (
  <time dateTime={new Date(timestamp).toISOString()} suppressHydrationWarning>
    {new Date(timestamp).toLocaleDateString()}
  </time>
)
