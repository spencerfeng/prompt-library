"use client"

type Props = {
  timestamp: number
}

export const FormattedDate = ({ timestamp }: Props) => (
  <>{new Date(timestamp).toLocaleDateString()}</>
)
