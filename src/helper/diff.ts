import { diff3Merge } from "node-diff3"

export type FieldStatus =
  | "unchanged"
  | "upstream-only"
  | "customer-only"
  | "conflict"

export type MergeHunk =
  | { type: "merged"; lines: string[] }
  | { type: "conflict"; upstream: string[]; customer: string[] }

export type MergeResult =
  | { ok: true; result: string }
  | { ok: false; hunks: MergeHunk[] }

/**
 * 3-way field-level diff for short string values (title, description, tags).
 * Returns the relationship between base, upstream, and customer values.
 */
export const diffField = (
  base: string,
  upstream: string,
  customer: string
): FieldStatus => {
  const upstreamChanged = upstream !== base
  const customerChanged = customer !== base

  if (!upstreamChanged && !customerChanged) return "unchanged"
  if (upstreamChanged && !customerChanged) return "upstream-only"
  if (!upstreamChanged && customerChanged) return "customer-only"
  return "conflict"
}

/**
 * 3-way line-level merge for template strings.
 * Upstream-only and customer-only line changes are auto-merged silently.
 * Only returns conflict hunks where both sides touched the same lines.
 */
export const mergeTemplate = (
  base: string,
  upstream: string,
  customer: string
): MergeResult => {
  const baseLines = base.split("\n")
  const upstreamLines = upstream.split("\n")
  const customerLines = customer.split("\n")

  // diff3Merge(a, o, b): a=upstream, o=base, b=customer
  const regions = diff3Merge(upstreamLines, baseLines, customerLines)

  const hunks: MergeHunk[] = []
  let hasConflict = false

  for (const region of regions) {
    if ("ok" in region && region.ok) {
      hunks.push({ type: "merged", lines: region.ok })
    } else if ("conflict" in region && region.conflict) {
      hasConflict = true
      hunks.push({
        type: "conflict",
        upstream: region.conflict.a ?? [],
        customer: region.conflict.b ?? []
      })
    }
  }

  if (!hasConflict) {
    const merged = hunks
      .flatMap((h) => (h.type === "merged" ? h.lines : []))
      .join("\n")
    return { ok: true, result: merged }
  }

  return { ok: false, hunks }
}
